package nl.han.ica.icss.transforms;

import nl.han.ica.datastructures.HANLinkedList;
import nl.han.ica.datastructures.IHANLinkedList;
import nl.han.ica.icss.ast.*;
import nl.han.ica.icss.ast.literals.*;
import nl.han.ica.icss.ast.operations.AddOperation;
import nl.han.ica.icss.ast.operations.MultiplyOperation;
import nl.han.ica.icss.ast.operations.SubtractOperation;

import java.util.ArrayList;
import java.util.HashMap;

public class Evaluator implements Transform {

    private IHANLinkedList<HashMap<String, Literal>> variableValues;

    public Evaluator() {
        variableValues = new HANLinkedList<>();
    }

    @Override
    public void apply(AST ast) {
        variableValues = new HANLinkedList<>();
        Stylesheet stylesheet = ast.root;

        System.out.println("\n");

        System.out.println("========================");
        System.out.println("TRANSFORMING STYLESHEET: " + stylesheet.toString());
        System.out.println("========================");

        addScope(1);

        for (ASTNode childNode: stylesheet.body) {
            if (childNode instanceof Stylerule) {
                transformStyleRule((Stylerule) childNode);
            } else if (childNode instanceof VariableAssignment) {
                addVariableAssignment(1, (VariableAssignment) childNode);
            }
        }

        removeScope(1);
    }

    private void transformStyleRule(Stylerule stylerule) {
        System.out.println("TRANSFORMING STYLERULE: " + stylerule.toString());
        ArrayList<ASTNode> transformedStyleRule = new ArrayList<>();

        int scope = 2;

        addScope(scope);

        for (ASTNode childOfStyleRule: stylerule.body) {
            transformStyleRuleChildren(scope, childOfStyleRule, transformedStyleRule);
        }

        removeScope(scope);

        stylerule.body = transformedStyleRule;
    }

    private void transformStyleRuleChildren(int scope,  ASTNode childOfStyleRule, ArrayList<ASTNode> transformedBody) {
            System.out.println("TRANSFORMING STYLERULE CHILD: " + childOfStyleRule.toString());

            if (childOfStyleRule instanceof Declaration) {
                transformDeclaration((Declaration) childOfStyleRule, transformedBody);
            }

            if (childOfStyleRule instanceof VariableAssignment) {
                addVariableAssignment(scope, (VariableAssignment) childOfStyleRule);
            }

            if (childOfStyleRule instanceof IfClause) {

                IfClause ifClause = (IfClause) childOfStyleRule;
                ifClause.conditionalExpression = transformIfExpression(ifClause);

                //IF is true
                if (((BoolLiteral) ifClause.conditionalExpression).value) {
                    //ELSE exists
                    if (ifClause.elseClause != null) {
                        ifClause.elseClause.body = new ArrayList<>();
                    }
                    //IF is not true
                } else {
                    //ELSE does not exist
                    if (ifClause.elseClause == null) {
                        ifClause.body = new ArrayList<>();
                    } else {
                        //ELSE exists
                        ifClause.body = ifClause.elseClause.body;
                        ifClause.elseClause.body = new ArrayList<>();
                    }
                }

                transformIfClause(scope, ifClause, transformedBody);
            }
    }

    private void transformDeclaration(Declaration declaration, ArrayList<ASTNode> transformedBody) {
        System.out.println("TRANSFORMING DECLARATION: " + declaration.toString());

        if(declaration.expression instanceof Operation) {
            declaration.expression = calculate((Operation) declaration.expression);
            transformExpression(declaration, transformedBody);
        } else if (declaration.expression instanceof VariableReference){
            declaration.expression = getVariableLiteral((VariableReference) declaration.expression);
            transformExpression(declaration, transformedBody);
        } else {
            transformExpression(declaration, transformedBody);
        }
    }

    private void transformExpression(Declaration declaration, ArrayList<ASTNode> transformedBody) {
        transformedBody.add(declaration);
    }

    private void transformIfClause(int scope, IfClause ifClause, ArrayList<ASTNode> transformedBody) {
        System.out.println("TRANSFORMING IF CLAUSE: " + ifClause.toString());
        for (ASTNode childOfIfClause : ifClause.getChildren()) {
            transformStyleRuleChildren(scope, childOfIfClause, transformedBody);
        }
    }

    private Literal transformIfExpression(IfClause ifClause) {
        if(!(ifClause.conditionalExpression instanceof BoolLiteral)) {
            return getVariableLiteral((VariableReference) ifClause.conditionalExpression);
        }
        return (BoolLiteral) ifClause.conditionalExpression;
    }

    private Literal calculate(Operation operation) {
        Expression leftValue = operation.lhs;
        Expression rightValue = operation.rhs;

        if (leftValue instanceof Operation){
            leftValue = calculate((Operation) leftValue);
        }
        if (rightValue instanceof Operation){
            rightValue = calculate((Operation) rightValue);
        }

        if(leftValue instanceof VariableReference) {
            leftValue = getVariableLiteral((VariableReference) leftValue);
        }
        if(rightValue instanceof VariableReference) {
            rightValue = getVariableLiteral((VariableReference) rightValue);
        }

        if (leftValue instanceof PercentageLiteral || rightValue instanceof PercentageLiteral){
            return new PercentageLiteral(calculateValue(operation, getValue(leftValue), getValue(rightValue)));
        } else if (leftValue instanceof PixelLiteral || rightValue instanceof PixelLiteral){
            return new PixelLiteral(calculateValue(operation, getValue(leftValue), getValue(rightValue)));
        } else if (leftValue instanceof ScalarLiteral && rightValue instanceof ScalarLiteral) {
            return new ScalarLiteral(calculateValue(operation, getValue(leftValue), getValue(rightValue)));
        }
        return null;
    }

    private int calculateValue(Operation operation, int leftValue, int rightValue) {
        if (operation instanceof AddOperation){
            return leftValue + rightValue;
        } else if (operation instanceof MultiplyOperation){
            return leftValue * rightValue;
        } else if (operation instanceof SubtractOperation){
            return leftValue - rightValue;
        }
        return 0;
    }

    private int getValue(Expression value) {
        if (value instanceof ScalarLiteral){
            return ((ScalarLiteral) value).value;
        } else if (value instanceof PercentageLiteral){
            return ((PercentageLiteral) value).value;
        } else if (value instanceof PixelLiteral){
            return ((PixelLiteral) value).value;
        } else if (value instanceof VariableReference){
            return getValue(getVariableLiteral((VariableReference) value));
        }
        return 0;
    }

    private Literal getVariableLiteral(VariableReference variableReference) {
        for (int i = variableValues.getSize(); i >= 1 ; i--) {
            HashMap<String, Literal> hashMap = variableValues.get(i);
            if (hashMap.containsKey(variableReference.name)) {
                return hashMap.get(variableReference.name);
            }
        }
        return null;
    }

    private void addScope(int scope) {
        variableValues.insert(scope, new HashMap<>());
    }

    private void removeScope(int scope) {
        variableValues.delete(scope);
    }

    private void addVariableAssignment(int scope, VariableAssignment variableAssignment) {
        Expression expression = variableAssignment.expression;
        if (expression instanceof Operation) {
            Literal calculatedExpression = calculate((Operation) expression);
            variableValues.get(scope).put(variableAssignment.name.name, calculatedExpression);
            transformVariableAssignment(variableAssignment, calculatedExpression);
        } else if (expression instanceof Literal) {
            variableValues.get(scope).put(variableAssignment.name.name, (Literal) variableAssignment.expression);
        }
    }

    private void transformVariableAssignment(VariableAssignment variableAssignment, Literal calculatedExpression) {
        variableAssignment.expression = calculatedExpression;
    }
}

package nl.han.ica.icss.checker;

import nl.han.ica.datastructures.HANLinkedList;
import nl.han.ica.datastructures.IHANLinkedList;
import nl.han.ica.icss.ast.*;
import nl.han.ica.icss.ast.literals.*;
import nl.han.ica.icss.ast.operations.AddOperation;
import nl.han.ica.icss.ast.operations.MultiplyOperation;
import nl.han.ica.icss.ast.operations.SubtractOperation;
import nl.han.ica.icss.ast.types.ExpressionType;

import java.util.ArrayList;
import java.util.HashMap;

public class Checker {

    private IHANLinkedList<HashMap<String,ExpressionType>> variableTypes;

    public void check(AST ast) {
        variableTypes = new HANLinkedList<>();
        Stylesheet stylesheet = ast.root;

        System.out.println("========================");
        System.out.println("CHECKING STYLESHEET: " + stylesheet.toString());
        System.out.println("========================");

        addScope(1);

        for (ASTNode child: stylesheet.body) {
            if (child instanceof Stylerule) {
                checkStyleRule((Stylerule) child);
            } else if (child instanceof VariableAssignment) {
                addVariable(1, (VariableAssignment) child);
            }
        }

        removeScope(1);
    }

    private void checkStyleRule(Stylerule stylerule) {
        System.out.println("CHECKING STYLERULE: " + stylerule.toString());

        int scope = 2;

        addScope(scope);

        for (ASTNode childOfStyleRule: stylerule.body) {
            checkStyleRuleChildren(scope, childOfStyleRule);
        }

        removeScope(scope);
    }

    private void checkStyleRuleChildren(int scope, ASTNode childOfStyleRule){
        System.out.println("CHECKING STYLERULE CHILDREN: " + childOfStyleRule.toString());

        if (childOfStyleRule instanceof Declaration){
            checkDecleration((Declaration) childOfStyleRule);
        }

        if (childOfStyleRule instanceof VariableAssignment){
            addVariable(scope, (VariableAssignment) childOfStyleRule);
        }

        if (childOfStyleRule instanceof IfClause){
            addScope(scope + 1);

            checkIfClause((IfClause) childOfStyleRule);

            for (ASTNode childOfIfClause: childOfStyleRule.getChildren()) {
                checkStyleRuleChildren(scope + 1, childOfIfClause);
            }

            removeScope(scope + 1);
        }

        if (childOfStyleRule instanceof ElseClause) {
            addScope(scope + 1);

            for (ASTNode childOfElseClause: childOfStyleRule.getChildren()) {
                checkStyleRuleChildren(scope + 1, childOfElseClause);
            }

            removeScope(scope + 1);
        }

        if (childOfStyleRule instanceof Operation){
            checkOperation((Operation) childOfStyleRule, getExpressionType(((Operation) childOfStyleRule).lhs), getExpressionType(((Operation) childOfStyleRule).rhs));
        }
    }

    private void checkDecleration(Declaration declaration){
        System.out.println("CHECKING DECLARATION: " + declaration.toString());

        ArrayList<ASTNode> children = declaration.getChildren();

        PropertyName property = (PropertyName) children.get(0);
        ExpressionType expressionType = getExpressionType((Expression) children.get(1));

        if (property.name.equals("color") || property.name.equals("background-color")) {
            checkColorDeclaration(declaration, expressionType);
        } else if (property.name.equals("width") || property.name.equals("height")) {
            checkPercentageOrPixelDeclaration(declaration, expressionType);
        }
    }

    private void checkIfClause(IfClause ifClause) {
        System.out.println("CHECKING IF CLAUSE: " + ifClause.toString());

        if (getExpressionType(ifClause.conditionalExpression) != ExpressionType.BOOL){
            ifClause.setError("At if clause " + ifClause.getConditionalExpression().getNodeLabel() + " --- The condition must be a boolean");
        }
    }

    private void checkOperation(Operation operation, ExpressionType leftSideExpressionType, ExpressionType rightSideExpressionType) {
        System.out.println("CHECKING OPERATION: " + operation.toString());

        if (operation instanceof MultiplyOperation){
            if (leftSideExpressionType != ExpressionType.SCALAR && rightSideExpressionType != ExpressionType.SCALAR){
                operation.setError("At operation " + operation.getNodeLabel() + " --- Only scalar values can be used in a Multiply operation");
            }
        }

        if (operation instanceof AddOperation || operation instanceof SubtractOperation){
            if (rightSideExpressionType == ExpressionType.SCALAR && leftSideExpressionType == ExpressionType.SCALAR){
                operation.setError("At operation " + operation.getNodeLabel() + " --- Adding or Subtracting using 2 scalar values is not allowed");
            } else if (rightSideExpressionType != leftSideExpressionType){
                operation.setError("At operation " + operation.getNodeLabel() + " --- Values of add or subtract operations must be of the same type");
            }
        }

        if (leftSideExpressionType == ExpressionType.COLOR){
            operation.setError("At operation " + operation.getNodeLabel() + " --- Colors cannot be used in operations");
        }
    }

    private void checkColorDeclaration(Declaration declaration, ExpressionType expressionType) {
        System.out.println("CHECKING COLOR LITERAL: " + declaration.toString());

        if (expressionType != ExpressionType.COLOR) {
            declaration.setError("At property " + declaration.property.name + " --- Value must be a color");
        }
    }

    private void checkPercentageOrPixelDeclaration(Declaration declaration, ExpressionType expressionType) {
        System.out.println("CHECKING PERCENTAGE OR PIXEL LITERAL: " + declaration.toString());

        if (expressionType != ExpressionType.PERCENTAGE && expressionType != ExpressionType.PIXEL){
            declaration.setError("At property " + declaration.property.name + " --- Value must be either a percentage, pixel or scalar");
        }
    }

    private ExpressionType getExpressionType(Expression expression) {
        ExpressionType type = null;

        if (expression instanceof BoolLiteral){
            type = ExpressionType.BOOL;
        } else if (expression instanceof ColorLiteral){
            type = ExpressionType.COLOR;
        } else if (expression instanceof PercentageLiteral){
            type = ExpressionType.PERCENTAGE;
        } else if (expression instanceof PixelLiteral){
            type = ExpressionType.PIXEL;
        } else if (expression instanceof ScalarLiteral) {
            type = ExpressionType.SCALAR;
        } else if (expression instanceof VariableReference){
            return getVariableType((VariableReference) expression);
        } else if (expression instanceof Operation){
            return getOperationType((Operation) expression);
        }

        return type;
    }

    private ExpressionType getVariableType(VariableReference variableReference) {
        for (int i = variableTypes.getSize(); i >= 1; i--) {
            HashMap<String, ExpressionType> hashMap = variableTypes.get(i);
            if (hashMap.containsKey(variableReference.name)) {
                return hashMap.get(variableReference.name);
            }
        }
        variableReference.setError("At variable " + variableReference.name + " --- Variable is not defined");
        return null;
    }

    private ExpressionType getOperationType(Operation operation) {
        checkOperation(operation, getExpressionType(operation.lhs), getExpressionType(operation.rhs));

        ExpressionType leftType = getExpressionType(operation.lhs);
        ExpressionType rightType = getExpressionType(operation.rhs);

        if (operation instanceof MultiplyOperation){
            if (leftType == ExpressionType.SCALAR){
                return rightType;
            } else {
                return leftType;
            }
        }

        return leftType;
    }

    private void addScope(int scope) {
        System.out.println("ADD SCOPE " + scope);
        variableTypes.insert(scope, new HashMap<>());
    }
    private void removeScope(int scope) {
        System.out.println("REMOVE SCOPE " + scope);
        variableTypes.delete(scope);
    }
    private void addVariable(int scope, VariableAssignment variableAssignment) {
        System.out.println("ADD VARIABLE ASSIGNMENT " + variableAssignment.toString() + " AT SCOPE: " + scope);
        variableTypes.get(scope).put(variableAssignment.name.name, getExpressionType(variableAssignment.expression));
    }
}

package nl.han.ica.icss.parser;

import nl.han.ica.datastructures.HANStack;
import nl.han.ica.datastructures.IHANStack;
import nl.han.ica.icss.ast.*;
import nl.han.ica.icss.ast.literals.*;
import nl.han.ica.icss.ast.operations.AddOperation;
import nl.han.ica.icss.ast.operations.MultiplyOperation;
import nl.han.ica.icss.ast.operations.SubtractOperation;
import nl.han.ica.icss.ast.selectors.ClassSelector;
import nl.han.ica.icss.ast.selectors.IdSelector;
import nl.han.ica.icss.ast.selectors.TagSelector;
import org.antlr.v4.runtime.ParserRuleContext;
import org.antlr.v4.runtime.tree.ErrorNode;
import org.antlr.v4.runtime.tree.TerminalNode;

/**
 * This class extracts the ICSS Abstract Syntax Tree from the Antlr Parse tree.
 */
public class ASTListener extends ICSSBaseListener {
	
	//Accumulator attributes:
	private AST ast;

	//Use this to keep track of the parent nodes when recursively traversing the ast
	private IHANStack<ASTNode> currentContainer;

	public ASTListener() {
		ast = new AST();
		currentContainer = new HANStack<>();
	}
    public AST getAST() {
        return ast;
    }

	@Override public void enterStylesheet(ICSSParser.StylesheetContext ctx) {
		System.out.println("========================");
		System.out.println("START PARSING STYLESHEET");

		Stylesheet stylesheet = new Stylesheet();
		currentContainer.push(stylesheet);
		ast.setRoot(stylesheet);
	}

	@Override public void exitStylesheet(ICSSParser.StylesheetContext ctx) {
		System.out.println("DONE PARSING STYLESHEET: " + ctx.getText());
		System.out.println("========================");
		System.out.println("\n");
	}

	@Override public void enterVariableDeclaration(ICSSParser.VariableDeclarationContext ctx) {
		System.out.println("DONE PARSING VARIABLE DECLARATION: " + ctx.getText());
		currentContainer.push(new VariableAssignment().addChild(new VariableReference(ctx.getChild(0).getText())));
	}

	@Override public void exitVariableDeclaration(ICSSParser.VariableDeclarationContext ctx) {
		System.out.println("DONE PARSING VARIABLE DECLARATION: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterVariable(ICSSParser.VariableContext ctx) {
		System.out.println("START PARSING VARIABLE: " + ctx.getText());
		currentContainer.push(new VariableReference(ctx.getText()));
	}

	@Override public void exitVariable(ICSSParser.VariableContext ctx) {
		System.out.println("DONE PARSING VARIABLE: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterDeclaration(ICSSParser.DeclarationContext ctx) {
		System.out.println("START PARSING DECLARATION: " + ctx.getText());
		currentContainer.push(new Declaration());
	}

	@Override public void exitDeclaration(ICSSParser.DeclarationContext ctx) {
		System.out.println("DONE PARSING DECLARATION: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterRuleSet(ICSSParser.RuleSetContext ctx) {
		System.out.println("START PARSING RULE SET: " + ctx.getText());
		currentContainer.push(new Stylerule());
	}

	@Override public void exitRuleSet(ICSSParser.RuleSetContext ctx) {
		System.out.println("DONE PARSING RULE SET: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterIfClause(ICSSParser.IfClauseContext ctx) {
		System.out.println("START PARSING IF CLAUSE: " + ctx.getText());
		currentContainer.push(new IfClause());
	}

	@Override public void exitIfClause(ICSSParser.IfClauseContext ctx) {
		System.out.println("DONE PARSING IF CLAUSE: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterElseClause(ICSSParser.ElseClauseContext ctx) {
		System.out.println("START PARSING ELSE CLAUSE: " + ctx.getText());
		currentContainer.push(new ElseClause());
	}

	@Override public void exitElseClause(ICSSParser.ElseClauseContext ctx) {
		System.out.println("DONE PARSING ELSE CLAUSE: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterProperty(ICSSParser.PropertyContext ctx) {
		System.out.println("START PARSING PROPERTY: " + ctx.getText());
		currentContainer.push(new PropertyName(ctx.getText()));
	}

	@Override public void exitProperty(ICSSParser.PropertyContext ctx) {
		System.out.println("DONE PARSING PROPERTY: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterValue(ICSSParser.ValueContext ctx) {
		System.out.println("START PARSING VALUE: " + ctx.getText());
	}

	@Override public void exitValue(ICSSParser.ValueContext ctx) {
		System.out.println("DONE PARSING VALUE: " + ctx.getText());
	}

	@Override public void enterBoolLiteral(ICSSParser.BoolLiteralContext ctx) {
		System.out.println("START PARSING BOOL LITERAL: " + ctx.getText());
		currentContainer.push(new BoolLiteral(ctx.getText()));
	}

	@Override public void exitBoolLiteral(ICSSParser.BoolLiteralContext ctx) {
		System.out.println("DONE PARSING BOOL LITERAL: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterColorLiteral(ICSSParser.ColorLiteralContext ctx) {
		System.out.println("START PARSING COLOR LITERAL: " + ctx.getText());
		currentContainer.push(new ColorLiteral(ctx.getText()));
	}

	@Override public void exitColorLiteral(ICSSParser.ColorLiteralContext ctx) {
		System.out.println("DONE PARSING COLOR LITERAL: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterPercentageLiteral(ICSSParser.PercentageLiteralContext ctx) {
		System.out.println("START PARSING PERCENTAGE LITERAL: " + ctx.getText());
		currentContainer.push(new PercentageLiteral(ctx.getText()));
	}

	@Override public void exitPercentageLiteral(ICSSParser.PercentageLiteralContext ctx) {
		System.out.println("DONE PARSING PERCENTAGE LITERAL: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterPixelLiteral(ICSSParser.PixelLiteralContext ctx) {
		System.out.println("START PARSING PIXEL LITERAL: " + ctx.getText());
		currentContainer.push(new PixelLiteral(ctx.getText()));
	}

	@Override public void exitPixelLiteral(ICSSParser.PixelLiteralContext ctx) {
		System.out.println("DONE PARSING PIXEL LITERAL: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterScalarLiteral(ICSSParser.ScalarLiteralContext ctx) {
		System.out.println("START PARSING SCALAR LITERAL: " + ctx.getText());
		currentContainer.push(new ScalarLiteral(ctx.getText()));
	}

	@Override public void exitScalarLiteral(ICSSParser.ScalarLiteralContext ctx) {
		System.out.println("DONE PARSING SCALAR LITERAL: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterOperation(ICSSParser.OperationContext ctx) {
		System.out.println("START PARSING OPERATION: " + ctx.getText());
	}

	@Override public void exitOperation(ICSSParser.OperationContext ctx) {
		System.out.println("DONE PARSING OPERATION: " + ctx.getText());
	}

	@Override public void enterMultiply(ICSSParser.MultiplyContext ctx) {
		System.out.println("START PARSING MULTIPLY: " + ctx.getText());
		currentContainer.push(new MultiplyOperation());
	}

	@Override public void exitMultiply(ICSSParser.MultiplyContext ctx) {
		System.out.println("DONE PARSING MULTIPLY: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterAddition(ICSSParser.AdditionContext ctx) {
		System.out.println("START PARSING ADDITION: " + ctx.getText());
		currentContainer.push(new AddOperation());
	}

	@Override public void exitAddition(ICSSParser.AdditionContext ctx) {
		System.out.println("DONE PARSING ADDITION: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterSubtraction(ICSSParser.SubtractionContext ctx) {
		System.out.println("START PARSING SUBTRACTION: " + ctx.getText());
		currentContainer.push(new SubtractOperation());
	}

	@Override public void exitSubtraction(ICSSParser.SubtractionContext ctx) {
		System.out.println("DONE PARSING SUBTRACTION: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterAtom(ICSSParser.AtomContext ctx) {
		System.out.println("START PARSING ATOM: " + ctx.getText());
	}

	@Override public void exitAtom(ICSSParser.AtomContext ctx) {
		System.out.println("DONE PARSING ATOM: " + ctx.getText());
	}

	@Override public void enterAttribute(ICSSParser.AttributeContext ctx) {
		System.out.println("START PARSING ATTRIBUTE: " + ctx.getText());
	}

	@Override public void exitAttribute(ICSSParser.AttributeContext ctx) {
		System.out.println("DONE PARSING ATTRIBUTE: " + ctx.getText());
	}

	@Override public void enterSelector(ICSSParser.SelectorContext ctx) {
		System.out.println("START PARSING CLASS SELECTOR: " + ctx.getText());
	}

	@Override public void exitSelector(ICSSParser.SelectorContext ctx) {
		System.out.println("START PARSING CLASS SELECTOR: " + ctx.getText());
	}

	@Override public void enterClassSelector(ICSSParser.ClassSelectorContext ctx) {
		System.out.println("START PARSING CLASS SELECTOR: " + ctx.getText());
		currentContainer.push(new ClassSelector(ctx.getText()));
	}

	@Override public void exitClassSelector(ICSSParser.ClassSelectorContext ctx) {
		System.out.println("DONE PARSING CLASS SELECTOR: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterIdSelector(ICSSParser.IdSelectorContext ctx) {
		System.out.println("START PARSING ID SELECTOR: " + ctx.getText());
		currentContainer.push(new IdSelector(ctx.getText()));
	}

	@Override public void exitIdSelector(ICSSParser.IdSelectorContext ctx) {
		System.out.println("DONE PARSING ID SELECTOR: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterTagSelector(ICSSParser.TagSelectorContext ctx) {
		System.out.println("START PARSING TAG SELECTOR: " + ctx.getText());
		currentContainer.push(new TagSelector(ctx.getText()));
	}

	@Override public void exitTagSelector(ICSSParser.TagSelectorContext ctx) {
		System.out.println("DONE PARSING TAG SELECTOR: " + ctx.getText());
		addChildASTNode();
	}

	@Override public void enterEveryRule(ParserRuleContext ctx) { }

	@Override public void exitEveryRule(ParserRuleContext ctx) { }

	@Override public void visitTerminal(TerminalNode node) { }

	@Override public void visitErrorNode(ErrorNode node) { }

	private void addChildASTNode() {
		ASTNode child = currentContainer.pop();
		currentContainer.peek().addChild(child);
	}
}
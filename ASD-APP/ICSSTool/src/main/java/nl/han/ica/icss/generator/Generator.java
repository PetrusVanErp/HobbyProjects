package nl.han.ica.icss.generator;

import nl.han.ica.icss.ast.*;
import nl.han.ica.icss.ast.literals.*;

public class Generator {

	StringBuilder tree = new StringBuilder();

	public String generate(AST ast) {
		System.out.println("\n");

		System.out.println("========================");
		System.out.println("GENERATING STYLESHEET: " + ast.root.toString());
		System.out.println("========================");

		generateStyleRules(ast.root);
        return tree.toString();
	}

	private void generateStyleRules(ASTNode astNode) {
		for (ASTNode node: astNode.getChildren()) {
			if(node instanceof Stylerule) {
				tree.append(((Stylerule) node).selectors.get(0)).append(" {\n");
				generateDeclarations(node);
				tree.append("}\n");
			}
		}
	}

	private void generateDeclarations(ASTNode astNode) {
		System.out.println("GENERATING DECLARATIONS");
		for (ASTNode node: astNode.getChildren()) {
			if (node instanceof Declaration) {
				tree.append("  ").append(((Declaration) node).property.name).append(": ");
				generateLiteral(((Declaration) node).expression);
			}
		}
	}

	private void generateLiteral(Expression expression) {
		if(expression instanceof PixelLiteral) {
			tree.append(((PixelLiteral) expression).value).append("px").append(";\n");
		} else if (expression instanceof PercentageLiteral) {
			tree.append(((PercentageLiteral) expression).value).append("%").append(";\n");
		} else if (expression instanceof ScalarLiteral) {
			tree.append(((ScalarLiteral) expression).value).append(";\n");
		} else if (expression instanceof ColorLiteral) {
			tree.append(((ColorLiteral) expression).value).append(";\n");
		} else if (expression instanceof BoolLiteral) {
			tree.append(((BoolLiteral) expression).value).append(";\n");
		}
	}
	
}

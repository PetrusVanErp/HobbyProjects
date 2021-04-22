grammar ICSS;

//--- LEXER: ---

// IF support:
IF: 'if';
ELSE: 'else';
BOX_BRACKET_OPEN: '[';
BOX_BRACKET_CLOSE: ']';


//Literals
TRUE: 'TRUE';
FALSE: 'FALSE';
PIXELSIZE: [0-9]+ 'px';
PERCENTAGE: [0-9]+ '%';
SCALAR: [0-9]+;


//Color value takes precedence over id idents
COLOR: '#' [0-9a-f] [0-9a-f] [0-9a-f] [0-9a-f] [0-9a-f] [0-9a-f];

//Specific identifiers for id's and css classes
ID_IDENT: '#' [a-z0-9\-]+;
CLASS_IDENT: '.' [a-z0-9\-]+;

//General identifiers
LOWER_IDENT: [a-z] [a-z0-9\-]*;
CAPITAL_IDENT: [A-Z] [A-Za-z0-9_]*;

//All whitespace is skipped
WS: [ \t\r\n]+ -> skip;

//
OPEN_BRACE: '{';
CLOSE_BRACE: '}';
SEMICOLON: ';';
COLON: ':';
PLUS: '+';
MIN: '-';
MUL: '*';
ASSIGNMENT_OPERATOR: ':=';




//--- PARSER: ---
stylesheet: (variableDeclaration | ruleSet)*;

variableDeclaration: (CAPITAL_IDENT | LOWER_IDENT) ASSIGNMENT_OPERATOR value SEMICOLON;
variable: CAPITAL_IDENT;

declaration: property COLON value+ SEMICOLON;
ruleSet: selector+ OPEN_BRACE (declaration | ifClause | variableDeclaration)* CLOSE_BRACE;

ifClause: IF attribute OPEN_BRACE (declaration | ifClause | variableDeclaration)* CLOSE_BRACE elseClause?;
elseClause: ELSE OPEN_BRACE (declaration | ifClause | variableDeclaration)* CLOSE_BRACE;

property: LOWER_IDENT;

value: pixelLiteral | percentageLiteral | colorLiteral | boolLiteral | scalarLiteral | variable | operation;

boolLiteral: TRUE | FALSE;
colorLiteral: COLOR;
percentageLiteral: PERCENTAGE;
pixelLiteral: PIXELSIZE;
scalarLiteral: SCALAR;

operation: multiply | addition | subtraction | atom;
multiply: atom MUL atom | multiply MUL operation;
addition: atom PLUS atom | atom PLUS operation | multiply PLUS operation;
subtraction: atom MIN atom | atom MIN operation | multiply MIN operation;
atom: pixelLiteral | scalarLiteral | percentageLiteral | colorLiteral | variable;

attribute: BOX_BRACKET_OPEN (variable | boolLiteral) BOX_BRACKET_CLOSE;

selector: (classSelector | idSelector | tagSelector) | selector attribute;
classSelector: CLASS_IDENT;
idSelector: ID_IDENT;
tagSelector: LOWER_IDENT | CAPITAL_IDENT;




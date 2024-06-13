
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can choose any theme you like

// eslint-disable-next-line react/prop-types
const CodeSnippet = ({ codeString }) => {
    return (
        <SyntaxHighlighter language="javascript" style={coldarkDark}>
            {codeString}
        </SyntaxHighlighter>
    );
};

export default CodeSnippet;

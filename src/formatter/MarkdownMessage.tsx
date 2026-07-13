import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CSSProperties } from "react";
import { Copy, Check } from "lucide-react"; // or any icon lib you use
import "./MarkdownMessage.css";

type Props = {
  message: string;
};

const syntaxStyle = oneDark as unknown as { [key: string]: CSSProperties };

// Separate component so each code block manages its own "copied" state
const CodeBlock = ({
  language,
  value,
}: {
  language: string;
  value: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang">{language || "text"}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={syntaxStyle}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: "0 0 8px 8px",
          fontSize: 13.5,
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownMessage = ({ message }: Props) => {
  return (
    <div className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            const value = String(children).replace(/\n$/, "");

            if (!isInline) {
              return <CodeBlock language={match[1]} value={value} />;
            }

            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;

// way 02
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// type Props = {
//   message: string;
// };

// const MarkdownMessage = ({ message }: Props) => {
//   return (
//     <ReactMarkdown
//       remarkPlugins={[remarkGfm]}
//       components={{
//         code({ inline, className, children, ...props }) {
//           const match = /language-(\w+)/.exec(className || "");

//           if (!inline && match) {
//             return (
//               <SyntaxHighlighter
//                 language={match[1]}
//                 style={oneDark}
//                 PreTag="div"
//                 {...props}
//               >
//                 {String(children).replace(/\n$/, "")}
//               </SyntaxHighlighter>
//             );
//           }

//           return (
//             <code className={className} {...props}>
//               {children}
//             </code>
//           );
//         },
//       }}
//     >
//       {message}
//     </ReactMarkdown>
//   );
// };

// export default MarkdownMessage;

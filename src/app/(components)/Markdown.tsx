import ReactMarkdown from "react-markdown";

export default function Markdown(props: { text: string }) {
  return (
    <ReactMarkdown
      className="flex flex-col gap-3 mt-[2dvh] text-gray-600 leading-relaxed flex-1 text-sm lg:text-base"
      components={{
        h1: ({ ...props }) => (
          <h1 className="text-xl lg:text-2xl font-semibold" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-lg lg:text-xl font-semibold" {...props} />
        ),
        ul: ({ ...props }) => (
          <ul className="p-[20px] flex flex-col gap-2" {...props} />
        ),
        li: ({ ...props }) => <li className="list-disc" {...props} />,
      }}
    >
      {props.text}
    </ReactMarkdown>
  );
}

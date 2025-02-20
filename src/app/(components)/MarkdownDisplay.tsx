import Markdown from "./Markdown";

export default function MarkdownDisplay(props: {
  text: string;
  show: boolean;
  function: () => void;
}) {
  if (props.show)
    return (
      <div className="fixed top-0 left-0 w-full h-full overflow-y-auto">
        <div className="w-full h-full bg-black bg-opacity-50 fixed -z-10" />
        <div className="w-[1000px] max-w-[100%] min-h-[100dvh] mx-auto border-slate-400 border border-1 p-[25px] flex flex-col bg-slate-100 lg:rounded-sm">
          <button
            onClick={props.function}
            className="text-2xl lg:text-3xl ml-auto"
          >
            X
          </button>
          <Markdown text={props.text} />
        </div>
      </div>
    );
}

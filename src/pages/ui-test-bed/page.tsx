interface UIButtonProp {
  value: string;
}

function UIButtonBright({ value }: UIButtonProp) {
  return (
    <div className="ui-button-small p-3 text-align ui-button-brignt ui-button text-xl text-[#B39879]">
      {value}
    </div>
  );
}

function UIButtonDark({ value }: UIButtonProp) {
  return (
    <div className="ui-button ui-panel-dark py-5 px-28 text-4xl text-white">
      {value}
    </div>
  );
}

function UIPaper() {
  return (
    <div className="ui-panel-paper-golden h-30 p-1">
      <div className="ui-panel-paper h-full w-full"></div>
    </div>
  );
}

function UIButtons() {
  return (
    <div className="relative p-4 pointer-events-auto flex flex-col gap-1.5 ui-panel-black">
      <UIButtonBright value={"나물"} />
      <UIButtonBright value={"나물"} />
      <UIButtonBright value={"나물"} />
      <UIButtonBright value={"나물"} />
      <UIButtonBright value={"나물"} />
      <UIButtonBright value={"나물"} />
      <UIButtonBright value={"나물"} />
      <UIButtonBright value={"나물"} />
      {/* <UIButblack value={"나물"} /> */}
    </div>
  );
}

function UIPapers() {
  return (
    <div className="relative p-4 pointer-events-auto grid grid-cols-3 gap-1 ui-panel-black">
      <UIPaper />
      <UIPaper />
      <UIPaper />
      <UIPaper />
      <UIPaper />
      <UIPaper />
      {/* <UIButtonDark value={"나물"} /> */}
    </div>
  );
}

function UIFelt() {
  return (
    <div className="relative p-8 pointer-events-auto h-[80%] ui-panel-felt flex flex-col justify-between">
      {/* <UIButtonDark value={"나물"} /> */}
      <div className="relative self-center">
        <UIButtonDark value={"확인"} />
      </div>
      <div className="self-center">
        <UIButtonDark value={"확인"} />
      </div>
    </div>
  );
}

function UIInk() {
  return (
    <div className="relative pt-16 pb-16 w-full h-full pointer-events-auto gap-2 ui-panel-ink flex flex-col justify-between">
      <div className="relative ui-panel-beige self-center" />
      <div className="relative ui-panel-beige self-center" />
    </div>
  );
}

export function UITestBedPage() {
  return (
    <div className="absolute ui-background-tmp p-4 left-0 right-0 w-full h-full flex flex-row gap-6 justify-start">
      <div className="relative flex flex-col w-72 h-full gap-2">
        <UIButtons />
        <UIPapers />
      </div>
      <div className="w-[35%]">
        <UIFelt />
      </div>
      <div className="grow h-full">
        <UIInk />
      </div>
    </div>
  );
}

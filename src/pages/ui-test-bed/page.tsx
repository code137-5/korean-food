import {
  PaperTile,
  TexturedButton,
  TexturedPanel,
  TexturedScreen,
} from "@/shared/ui/textured-ui";

const namulLabel = "\uB098\uBB3C";
const confirmLabel = "\uD655\uC778";

function UIButtons() {
  return (
    <TexturedPanel
      className="relative p-4 pointer-events-auto flex flex-col gap-1.5"
      variant="golden"
    >
      <TexturedButton>{namulLabel}</TexturedButton>
      <TexturedButton>{namulLabel}</TexturedButton>
      <TexturedButton>{namulLabel}</TexturedButton>
      <TexturedButton>{namulLabel}</TexturedButton>
      <TexturedButton>{namulLabel}</TexturedButton>
      <TexturedButton>{namulLabel}</TexturedButton>
      <TexturedButton>{namulLabel}</TexturedButton>
      <TexturedButton>{namulLabel}</TexturedButton>
    </TexturedPanel>
  );
}

function UIPapers() {
  return (
    <TexturedPanel
      className="relative p-4 pointer-events-auto grid grid-cols-3 gap-1"
      variant="golden"
    >
      <PaperTile />
      <PaperTile />
      <PaperTile />
      <PaperTile />
      <PaperTile />
      <PaperTile />
    </TexturedPanel>
  );
}

function UIFelt() {
  return (
    <TexturedPanel
      className="relative p-8 pointer-events-auto h-[80%] flex flex-col justify-between"
      variant="felt"
    >
      <div className="relative self-center">
        <TexturedButton size="lg" variant="dark">
          {confirmLabel}
        </TexturedButton>
      </div>
      <div className="self-center">
        <TexturedButton size="lg" variant="dark">
          {confirmLabel}
        </TexturedButton>
      </div>
    </TexturedPanel>
  );
}

function UIInk() {
  return (
    <TexturedPanel
      className="relative pt-16 pb-16 w-full h-full pointer-events-auto gap-2 flex flex-col justify-between"
      variant="ink"
    >
      <TexturedPanel className="relative self-center" variant="beige" />
      <TexturedPanel className="relative self-center" variant="beige" />
    </TexturedPanel>
  );
}

export function UITestBedPage() {
  return (
    <TexturedScreen className="absolute p-4 left-0 right-0 w-full h-full flex flex-row gap-6 justify-start">
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
    </TexturedScreen>
  );
}

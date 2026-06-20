import { useMemo, useState, type DragEvent } from "react";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PieChartItem = {
  id: string;
  name: string;
  value: number;
  color: string;
};

const INITIAL_ITEMS: PieChartItem[] = [
  { id: "rice", name: "밥", value: 35, color: "#f3ead7" },
  { id: "namul", name: "나물", value: 30, color: "#7fb069" },
  { id: "protein", name: "단백질", value: 20, color: "#c56a45" },
  { id: "sauce", name: "고추장", value: 15, color: "#9f1d20" },
];

const DEFAULT_COLORS = [
  "#f3ead7",
  "#7fb069",
  "#c56a45",
  "#9f1d20",
  "#d7ae67",
  "#6f4b27",
];

function createItemId() {
  return `item-${crypto.randomUUID()}`;
}

function clampValue(value: number) {
  if (Number.isNaN(value)) {
    return 1;
  }

  return Math.max(1, Math.min(value, 100));
}

function moveItem(items: PieChartItem[], fromId: string, toId: string) {
  const fromIndex = items.findIndex((item) => item.id === fromId);
  const toIndex = items.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function getDroppedName(event: DragEvent) {
  const jsonPayload = event.dataTransfer.getData("application/json");

  if (jsonPayload) {
    try {
      const payload = JSON.parse(jsonPayload) as { name?: unknown };
      if (typeof payload.name === "string" && payload.name.trim()) {
        return payload.name.trim();
      }
    } catch {
      return null;
    }
  }

  const textPayload = event.dataTransfer.getData("text/plain").trim();
  return textPayload || null;
}

function getPieItemId(data: unknown) {
  const payload = data as { id?: unknown; payload?: { id?: unknown } };
  const id = payload.id ?? payload.payload?.id;
  return typeof id === "string" ? id : null;
}

export function PieCharts() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [selectedId, setSelectedId] = useState(INITIAL_ITEMS[0]?.id ?? "");
  const [draftName, setDraftName] = useState("");
  const [draftValue, setDraftValue] = useState(10);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const totalValue = useMemo(
    () => items.reduce((total, item) => total + item.value, 0),
    [items],
  );
  const selectedItem =
    items.find((item) => item.id === selectedId) ?? items[0] ?? null;

  function addItem(name = draftName, value = draftValue) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nextItem: PieChartItem = {
      id: createItemId(),
      name: trimmedName,
      value: clampValue(value),
      color: DEFAULT_COLORS[items.length % DEFAULT_COLORS.length],
    };

    setItems((currentItems) => [...currentItems, nextItem]);
    setSelectedId(nextItem.id);
    setDraftName("");
    setDraftValue(10);
  }

  function deleteSelectedItem() {
    if (!selectedItem || items.length <= 1) {
      return;
    }

    const selectedIndex = items.findIndex((item) => item.id === selectedItem.id);
    const nextItems = items.filter((item) => item.id !== selectedItem.id);
    setItems(nextItems);
    setSelectedId(nextItems[Math.max(selectedIndex - 1, 0)]?.id ?? "");
  }

  function updateSelectedItem(nextFields: Partial<Omit<PieChartItem, "id">>) {
    if (!selectedItem) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === selectedItem.id ? { ...item, ...nextFields } : item,
      ),
    );
  }

  function handleDropOnChart(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedName = getDroppedName(event);

    if (droppedName) {
      addItem(droppedName, 10);
    }
  }

  return (
    <Card className="min-h-0 grow border-[#6e5134]/50 bg-[#120d08]/90 text-[#e9dcc6]">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-xl text-[#f3ead7]">
            비빔 구성 차트
          </CardTitle>
          <p className="mt-1 text-sm text-[#bba98c]">
            항목을 클릭해 상세를 확인하고, 목록을 드래그해 순서를 바꿀 수 있습니다.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-[#9f793e]/80 bg-[#20160d] text-[#d7ae67]"
        >
          총 {totalValue}
        </Badge>
      </CardHeader>

      <CardContent className="grid min-h-0 grow grid-rows-[minmax(16rem,1fr)_auto_auto] gap-4">
        <div
          className="min-h-64 rounded-lg border border-dashed border-[#9f793e]/60 bg-black/20 p-3"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDropOnChart}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Tooltip
                contentStyle={{
                  background: "#120d08",
                  border: "1px solid #6e5134",
                  color: "#e9dcc6",
                }}
              />
              <Pie
                data={items}
                dataKey="value"
                nameKey="name"
                innerRadius="48%"
                outerRadius="82%"
                paddingAngle={2}
                onClick={(data) => {
                  const id = getPieItemId(data);

                  if (id) {
                    setSelectedId(id);
                  }
                }}
              >
                {items.map((item) => (
                  <Cell
                    key={item.id}
                    fill={item.color}
                    stroke={item.id === selectedId ? "#fff3d1" : "#120d08"}
                    strokeWidth={item.id === selectedId ? 4 : 1}
                  />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-2 rounded-lg border border-[#5b442b]/80 bg-black/20 p-3">
          <div className="grid grid-cols-[1fr_5rem_auto] gap-2">
            <input
              className="h-9 rounded-md border border-[#5b442b] bg-[#090806] px-3 text-sm text-[#e9dcc6] outline-none focus:border-[#d7ae67]"
              placeholder="재료 이름"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
            <input
              className="h-9 rounded-md border border-[#5b442b] bg-[#090806] px-2 text-sm text-[#e9dcc6] outline-none focus:border-[#d7ae67]"
              type="number"
              min={1}
              max={100}
              value={draftValue}
              onChange={(event) =>
                setDraftValue(clampValue(Number(event.target.value)))
              }
            />
            <Button
              type="button"
              size="lg"
              className="bg-[#7a4f22] text-[#fff3d1] hover:bg-[#5f3c1a]"
              onClick={() => addItem()}
            >
              <Plus aria-hidden="true" />
              추가
            </Button>
          </div>

          {selectedItem ? (
            <div className="grid grid-cols-[1fr_5rem_3rem_auto] gap-2">
              <input
                className="h-9 rounded-md border border-[#5b442b] bg-[#090806] px-3 text-sm text-[#e9dcc6] outline-none focus:border-[#d7ae67]"
                value={selectedItem.name}
                onChange={(event) =>
                  updateSelectedItem({ name: event.target.value })
                }
              />
              <input
                className="h-9 rounded-md border border-[#5b442b] bg-[#090806] px-2 text-sm text-[#e9dcc6] outline-none focus:border-[#d7ae67]"
                type="number"
                min={1}
                max={100}
                value={selectedItem.value}
                onChange={(event) =>
                  updateSelectedItem({
                    value: clampValue(Number(event.target.value)),
                  })
                }
              />
              <input
                className="h-9 w-full rounded-md border border-[#5b442b] bg-[#090806]"
                type="color"
                value={selectedItem.color}
                onChange={(event) =>
                  updateSelectedItem({ color: event.target.value })
                }
                aria-label="선택 항목 색상"
              />
              <Button
                type="button"
                variant="destructive"
                size="lg"
                disabled={items.length <= 1}
                onClick={deleteSelectedItem}
              >
                <Trash2 aria-hidden="true" />
                삭제
              </Button>
            </div>
          ) : null}
        </div>

        <div className="min-h-0 overflow-y-auto rounded-lg border border-[#5b442b]/80 bg-black/20 p-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              draggable
              className={cn(
                "mb-2 grid w-full cursor-grab grid-cols-[1rem_1fr_auto] items-center gap-3 rounded-md border px-3 py-2 text-left text-sm active:cursor-grabbing",
                item.id === selectedId
                  ? "border-[#d7ae67] bg-[#3a2414] text-[#fff3d1]"
                  : "border-[#5b442b]/70 bg-[#090806] text-[#e5d5ba]",
              )}
              onClick={() => setSelectedId(item.id)}
              onDragStart={(event) => {
                setDraggingId(item.id);
                event.dataTransfer.setData("text/plain", item.name);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggingId) {
                  setItems((currentItems) =>
                    moveItem(currentItems, draggingId, item.id),
                  );
                }
                setDraggingId(null);
              }}
              onDragEnd={() => setDraggingId(null)}
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.name}</span>
              <span>{item.value}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

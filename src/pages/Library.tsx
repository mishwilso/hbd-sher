import { useState, useEffect } from "react";
import { Plus, Search, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getYaoiLibrary, setYaoiLibrary, type YaoiCard } from "@/lib/storage";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F'];

const TIER_COLORS = {
  S: 'from-pink-600 to-rose-600',
  A: 'from-pink-500 to-rose-500',
  B: 'from-pink-400 to-rose-400',
  C: 'from-fuchsia-400 to-pink-400',
  D: 'from-fuchsia-300 to-pink-300',
  F: 'from-gray-400 to-gray-500',
};

const Library = () => {
  const [library, setLibraryState] = useState<YaoiCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    setLibraryState(getYaoiLibrary());
  }, []);

  const saveLibrary = (lib: YaoiCard[]) => {
    setYaoiLibrary(lib);
    setLibraryState(lib);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeCard = library.find((c) => c.id === active.id);
    const overTier = over.id as Tier;

    if (activeCard && TIERS.includes(overTier)) {
      const updated = library.map((card) =>
        card.id === activeCard.id ? { ...card, tier: overTier } : card
      );
      saveLibrary(updated);
      toast.success(`Moved to ${overTier} tier!`);
    }
  };

  const addCard = (card: Omit<YaoiCard, 'id'>) => {
    const newCard: YaoiCard = {
      ...card,
      id: Date.now().toString(),
    };
    saveLibrary([...library, newCard]);
    toast.success(`Added "${card.title}" to library!`);
    setAddDialogOpen(false);
  };

  const removeCard = (id: string) => {
    saveLibrary(library.filter((c) => c.id !== id));
    toast.success("Removed from library");
  };

  const filteredLibrary = library.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container max-w-7xl px-4 py-8">
      <Card className="shadow-pink border-2">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-heading flex items-center gap-2">
                📚 Yaoi Tier Library
              </CardTitle>
              <CardDescription>
                Organize your collection from S (god-tier) to F (why-did-i-read-this)
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="pill">
                    <Plus className="h-4 w-4" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Card</DialogTitle>
                  </DialogHeader>
                  <AddCardForm onAdd={addCard} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl"
            />
          </div>

          {/* Tier List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-4">
              {TIERS.map((tier) => (
                <TierColumn
                  key={tier}
                  tier={tier}
                  cards={filteredLibrary.filter((c) => c.tier === tier)}
                  onRemove={removeCard}
                />
              ))}
            </div>

            <DragOverlay>
              {activeId ? (
                <YaoiCardComponent
                  card={library.find((c) => c.id === activeId)!}
                  isDragging
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          {library.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Your library is empty!</p>
              <p className="text-sm mt-2">Start adding your yaoi collection above 📚</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const TierColumn = ({
  tier,
  cards,
  onRemove,
}: {
  tier: Tier;
  cards: YaoiCard[];
  onRemove: (id: string) => void;
}) => {
  const { setNodeRef } = useSortable({ id: tier });

  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl border-2 border-border overflow-hidden"
    >
      <div
        className={cn(
          "p-3 bg-gradient-to-r text-white font-heading font-bold text-xl flex items-center gap-2",
          TIER_COLORS[tier]
        )}
      >
        <span>{tier} Tier</span>
        <span className="text-sm font-normal opacity-90">({cards.length})</span>
      </div>
      
      <div className="p-3 min-h-[100px] bg-card">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cards.map((card) => (
              <SortableYaoiCard key={card.id} card={card} onRemove={onRemove} />
            ))}
          </div>
        </SortableContext>
        
        {cards.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            Drag cards here or add new ones
          </p>
        )}
      </div>
    </div>
  );
};

const SortableYaoiCard = ({
  card,
  onRemove,
}: {
  card: YaoiCard;
  onRemove: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <YaoiCardComponent
        card={card}
        isDragging={isDragging}
        dragListeners={listeners}
        onRemove={onRemove}
      />
    </div>
  );
};

const YaoiCardComponent = ({
  card,
  isDragging,
  dragListeners,
  onRemove,
}: {
  card: YaoiCard;
  isDragging?: boolean;
  dragListeners?: any;
  onRemove?: (id: string) => void;
}) => {
  return (
    <div
      className={cn(
        "p-3 rounded-2xl border-2 bg-card shadow-card transition-smooth hover:shadow-pink cursor-move",
        isDragging && "opacity-50 shadow-pink"
      )}
    >
      <div className="flex items-start gap-2">
        <div {...dragListeners} className="cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold truncate">{card.title}</h4>
          
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {card.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {card.note && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {card.note}
            </p>
          )}
        </div>
        
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => onRemove(card.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

const AddCardForm = ({ onAdd }: { onAdd: (card: Omit<YaoiCard, 'id'>) => void }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [tier, setTier] = useState<Tier>('B');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      note: note.trim() || undefined,
      tier,
    });

    setTitle("");
    setTags("");
    setNote("");
    setTier('B');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tier">Tier</Label>
        <select
          id="tier"
          value={tier}
          onChange={(e) => setTier(e.target.value as Tier)}
          className="w-full h-10 px-3 rounded-2xl border border-input bg-background"
        >
          {TIERS.map((t) => (
            <option key={t} value={t}>{t} Tier</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="fluffy, angst, comedy..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Your thoughts..."
          rows={3}
        />
      </div>

      <Button type="submit" variant="pill" className="w-full">
        Add to Library
      </Button>
    </form>
  );
};

export default Library;

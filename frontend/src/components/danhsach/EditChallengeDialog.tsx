"use client";

import { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditChallengeDialogProps {
  initialTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (title: string, addDays: number) => void;
}

export default function EditChallengeDialog({
  initialTitle,
  isOpen,
  onOpenChange,
  onEdit,
}: EditChallengeDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [addDays, setAddDays] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(initialTitle);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddDays(0);
    }
  }, [isOpen, initialTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onEdit(title, addDays);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-1 border-border text-ink-3 hover:text-primary hover:border-primary/50">
            <Edit2 className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Chỉnh sửa</span>
          </Button>
        }
      />
      <DialogContent className="max-w-md w-full bg-card p-6 border border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-ink">
            Chỉnh sửa Thử thách
          </DialogTitle>
          <DialogDescription className="text-ink-4 text-xs mt-1">
            Bạn có thể đổi tên thử thách hoặc gia hạn thêm số ngày cam kết.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
              Tên thử thách:
            </Label>
            <Input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11 rounded-lg border-border bg-surface text-ink focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-days" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
              Gia hạn thêm ngày (nếu muốn):
            </Label>
            <p className="text-[10px] text-ink-4 -mt-1 mb-1">
              Điền số ngày bạn muốn duy trì thêm. Bỏ trống hoặc điền 0 nếu không muốn gia hạn.
            </p>
            <Input
              id="edit-days"
              type="number"
              min={0}
              max={365}
              value={addDays}
              onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
              className="h-11 rounded-lg border-border bg-surface text-ink focus-visible:ring-primary"
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <DialogClose
              render={
                <Button type="button" variant="outline" className="rounded-lg h-11 border-border font-bold">
                  Hủy bỏ
                </Button>
              }
            />
            <Button type="submit" className="bg-primary hover:bg-primary-soft text-primary-foreground rounded-lg h-11 font-bold">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

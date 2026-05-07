export type ItemType = 'idea' | 'task';
export type Priority = 'low' | 'medium' | 'high';

export interface Item {
  id: string;
  type: ItemType;
  content: string;
  completed: boolean;
  tags: string[];
  priority: Priority;
  created_at: string;
  updated_at: string;
}

export type CreateItemDTO = Omit<Item, 'id' | 'created_at' | 'updated_at'>;
export type UpdateItemDTO = Partial<CreateItemDTO>;

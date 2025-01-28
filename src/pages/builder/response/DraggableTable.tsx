import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Item {
  id: number;
  name: string;
  dataType: string;
  parentId?: number;
  isOptional?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  uniqueItems?: boolean;
  default?: string | number | boolean | object;
}

const initialItems: Item[] = [
  {
    id: 1,
    name: 'username',
    dataType: 'string',
    isOptional: false,
    minLength: 3,
    maxLength: 20,
  },
  {
    id: 2,
    name: 'age',
    dataType: 'number',
    minimum: 0,
    maximum: 120,
    default: 18,
  },
  {
    id: 3,
    name: 'email',
    dataType: 'string',
    pattern: '^[^@]+@[^@]+$',
    isOptional: true,
  },
];

const SortableRow = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

const SchemaTable: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    const item = items.find((i) => i.id === active.id);
    setActiveItem(item || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    setActiveItem(null);
  };

  const columns: ColumnsType<Item> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Data Type', dataIndex: 'dataType', key: 'dataType' },
    { title: 'Parent ID', dataIndex: 'parentId', key: 'parentId', render: (v) => v ?? '-' },
    { title: 'Optional', dataIndex: 'isOptional', key: 'isOptional', render: (v) => (v ? 'Yes' : 'No') },
    { title: 'Min Length', dataIndex: 'minLength', key: 'minLength', render: (v) => v ?? '-' },
    { title: 'Max Length', dataIndex: 'maxLength', key: 'maxLength', render: (v) => v ?? '-' },
    { title: 'Minimum', dataIndex: 'minimum', key: 'minimum', render: (v) => v ?? '-' },
    { title: 'Maximum', dataIndex: 'maximum', key: 'maximum', render: (v) => v ?? '-' },
    { title: 'Pattern', dataIndex: 'pattern', key: 'pattern', render: (v) => v ?? '-' },
    { title: 'Unique Items', dataIndex: 'uniqueItems', key: 'uniqueItems', render: (v) => (v ? 'Yes' : 'No') },
    { title: 'Default', dataIndex: 'default', key: 'default', render: (v) => (v !== undefined ? JSON.stringify(v) : '-') },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Table
          columns={columns}
          dataSource={items}
          rowKey="id"
          components={{
            body: {
              row: SortableRow,
            },
          }}
        />
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <table style={{ width: '100%' }}>
            <tbody>
              <tr style={{ background: '#fafafa' }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                    {activeItem[col.dataIndex as keyof Item]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SchemaTable;
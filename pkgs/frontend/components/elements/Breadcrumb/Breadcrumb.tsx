// Breadcrumb.tsx
import React from "react";

// BreadcrumbItem.ts
export interface BreadcrumbItem {
  text: string;
  path: string; // ナビゲートするパスや識別子
  cid: string; // ノードのCID
  subfolderKey: string; // ノードのサブフォルダーキー
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (number: number) => void; // 項目がクリックされたときのハンドラ
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <div className="text-TitleLarge">
      {items.map((item, index) => (
        <span key={index}>
          <a
            href="#"
            onClick={() => onNavigate(index)}
            style={{ marginRight: "8px" }}
          >
            {item.text}
          </a>
          {index < items.length - 1 ? "> " : ""}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;

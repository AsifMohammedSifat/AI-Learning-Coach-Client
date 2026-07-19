import { Radio } from "antd";
import type {
  TSupportCategory,
  TSupportLanguage,
} from "../redux/api/features/support/supportApi";
interface Props {
  category: TSupportCategory;
  language: TSupportLanguage;
  onCategoryChange: (c: TSupportCategory) => void;
  onLanguageChange: (l: TSupportLanguage) => void;
}

export default function CategoryPicker({
  category,
  language,
  onCategoryChange,
  onLanguageChange,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Radio.Group
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <Radio.Button value="coding">Coding</Radio.Button>
        <Radio.Button value="mental">Mental support</Radio.Button>
        <Radio.Button value="guidance">Learning guidance</Radio.Button>
        <Radio.Button value="general">Something else</Radio.Button>
      </Radio.Group>

      <Radio.Group
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <Radio.Button value="EN">English</Radio.Button>
        <Radio.Button value="BN">বাংলা</Radio.Button>
      </Radio.Group>
    </div>
  );
}

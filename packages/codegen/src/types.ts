export type IconPart = { id: string; d?: string };

export type IconMeta = {
  name: string;
  displayName: string;
  description?: string;
  viewBox: string;
  parts: IconPart[];
  morphCompatibleWith?: string[];
  aliases?: string[];
};

export type RegistryEntry = {
  name: string;
  version: string;
  svg: string;
  css: string;
  meta: IconMeta;
};

export type Framework = "react" | "vue" | "angular";

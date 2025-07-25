import { RefreshControlProps } from "react-native";
import { FlashListProps } from "@shopify/flash-list";

export interface GenericFlashListProps<T> extends Omit<FlashListProps<T>, "data" | "renderItem"> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  refreshControlProps?: Partial<RefreshControlProps>;
  emptyComponent?: React.ReactElement;
  emptyText?: string;
}

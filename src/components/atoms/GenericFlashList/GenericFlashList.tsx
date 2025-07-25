import React, { forwardRef, useCallback, useMemo } from "react";
import { RefreshControl, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useThemeStore } from "@store/themeStore";
import { LoadingSpinner } from "../LoadingSpinner";
import { useGenericFlashListStyles } from "./styles";
import { GenericFlashListProps } from "./types";

export const GenericFlashList = forwardRef<FlashList<any>, GenericFlashListProps<any>>(function GenericFlashList<T>(
  {
    data,
    renderItem,
    loading = false,
    refreshing = false,
    onRefresh,
    refreshControlProps,
    emptyComponent,
    emptyText = "No items found",
    keyExtractor,
    estimatedItemSize = 100,
    contentContainerStyle,
    ...flashListProps
  }: GenericFlashListProps<T>,
  ref: React.Ref<FlashList<any>>
) {
  const { theme } = useThemeStore();
  const styles = useGenericFlashListStyles();

  // Default key extractor
  const defaultKeyExtractor = useCallback((item: T, index: number) => {
    if (item && typeof item === "object" && "id" in item) {
      return String((item as any).id);
    }
    return String(index);
  }, []);

  // Empty component
  const renderEmptyComponent = useMemo(() => {
    if (emptyComponent) {
      return emptyComponent;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }, [emptyComponent, emptyText, styles.emptyContainer, styles.emptyText]);

  // Loading state
  if (loading && data.length === 0) {
    return <LoadingSpinner text="Loading..." />;
  }

  return (
    <FlashList
      ref={ref}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor || defaultKeyExtractor}
      estimatedItemSize={estimatedItemSize}
      contentContainerStyle={contentContainerStyle || styles.contentContainer}
      ListEmptyComponent={renderEmptyComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            {...refreshControlProps}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      {...flashListProps}
    />
  );
});

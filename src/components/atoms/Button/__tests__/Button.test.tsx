import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button Component", () => {
  const defaultProps = {
    title: "Test Button",
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Snapshots", () => {
    it("renders primary button correctly", () => {
      const tree = render(<Button {...defaultProps} variant="primary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders secondary button correctly", () => {
      const tree = render(<Button {...defaultProps} variant="secondary" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders ghost button correctly", () => {
      const tree = render(<Button {...defaultProps} variant="ghost" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders disabled button correctly", () => {
      const tree = render(<Button {...defaultProps} disabled />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders icon-only button correctly", () => {
      const tree = render(<Button onPress={defaultProps.onPress} icon="add" iconOnly />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders button with icon and title correctly", () => {
      const tree = render(<Button {...defaultProps} icon="heart" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("Behavior", () => {
    it("calls onPress when button is pressed", () => {
      const { getByText } = render(<Button {...defaultProps} />);
      const button = getByText("Test Button");

      fireEvent.press(button);

      expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when button is disabled", () => {
      const { getByText } = render(<Button {...defaultProps} disabled />);
      const button = getByText("Test Button");

      fireEvent.press(button);

      expect(defaultProps.onPress).not.toHaveBeenCalled();
    });

    it("renders correct testID", () => {
      const { getByTestId } = render(<Button {...defaultProps} testID="custom-button" />);

      expect(getByTestId("custom-button")).toBeTruthy();
    });

    it("renders icon when icon prop is provided", () => {
      const { getByTestId } = render(<Button {...defaultProps} icon="add" />);

      expect(getByTestId("icon-add")).toBeTruthy();
    });

    it("does not render title when iconOnly is true", () => {
      const { queryByText } = render(<Button onPress={defaultProps.onPress} icon="add" iconOnly />);

      expect(queryByText("Test Button")).toBeNull();
    });

    it("renders both icon and title when iconOnly is false", () => {
      const { getByText, getByTestId } = render(<Button {...defaultProps} icon="add" />);

      expect(getByText("Test Button")).toBeTruthy();
      expect(getByTestId("icon-add")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility properties", () => {
      const { getByRole } = render(<Button {...defaultProps} />);
      const button = getByRole("button");

      expect(button).toBeTruthy();
      expect(button.props.accessible).toBe(true);
    });

    it("has correct accessibility label", () => {
      const { getByLabelText } = render(<Button {...defaultProps} accessibilityLabel="Custom Label" />);

      expect(getByLabelText("Custom Label")).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined title gracefully", () => {
      const result = render(<Button onPress={defaultProps.onPress} />);

      expect(result).toBeTruthy();
    });

    it("handles multiple rapid presses", () => {
      const { getByText } = render(<Button {...defaultProps} />);
      const button = getByText("Test Button");

      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(defaultProps.onPress).toHaveBeenCalledTimes(3);
    });
  });
});

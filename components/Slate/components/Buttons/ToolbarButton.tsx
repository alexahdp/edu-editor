import React, { ReactNode, Ref } from 'react';
import { useSlate } from 'slate-react';
import { IconButton, PlacementWithLogical, Tooltip } from '@chakra-ui/react';
import { MdCropSquare } from 'react-icons/md';
import { Editor } from 'slate';

type TypeEnum = 'mark' | 'block' | 'link';

export interface ToolbarButtonProps {
  /**
   * Text displayed on the button tooltip. By Default it is the capitalized `format` string.
   * For instance, `bold` is displayed as `Bold`.
   */
  tooltip?: string;

  /**
   * Location where the tooltip will appear.
   * It can be `top`, `bottom`, `left`, `right`. Defaults to top.
   */
  placement?: PlacementWithLogical;

  /**
   * Toolbar button has the option of adding to the editor value marks and blocks.
   *
   * `mark` can be added to the editor value when you want to add something like `bold`, `italic`...
   *  Marks are rendered into HTML in `renderLeaf` of `GraspEditable`
   *
   * `block` to be added to the editor `value` when the button is pressed. For example: `header1`, `numbered-list`...
   *  `renderElement` of the `RichEditable` component will need to handle the actual conversion from mark to HTML/Component on render time.
   *
   * If you don't want to add a mark or a block do not set the prop or use whatever string.
   * You can perform the action the button triggers using onMouseDown().
   */
  type?: TypeEnum;

  /**
   *
   * The string that identifies the format of the block or mark to be added. For example: `bold`, `header1`...
   */
  format: string;

  /**
   *
   * When a button is active it means the button is highlighted. For example, if in current position of the cursor,
   * the text is bold, the bold button should be active.
   *
   * isActive is a function that returns true/false to indicate the status of the mark/block.
   * Set this function if you need to handle anything other than standard mark or blocks.
   */
  isActive?: () => boolean;

  /**
   * Unconditionally disables the button
   *
   * Disable a button means that the button cannot be clicked (note it is not the opposite of isActive)
   */
  disabled?: boolean;
  /**
   * If true, disables the button if there is a text selected on the editor.
   *
   * Disable a button means that the button cannot be clicked.
   *
   * Use either disableOnSelection or disableOnCollapse, but not both.
   */
  disableOnSelection?: boolean;

  /**
   * If true, disables the button when  there is no text selected or the editor has no focus.
   *
   * Disable a button means that button cannot be clicked.
   *
   * Use either disableOnSelection or disableOnCollapse, but not both.
   */
  disableOnCollapse?: boolean;

  /**
   * Instance a component. The icon that will be displayed. Typically an icon from @material-ui/icons
   */
  icon?: ReactNode;

  /**
   * On mouse down event is passed up to the parent with props that can be deconstructed in {editor, event, mark/block}
   */
  onMouseDown?: (params: {
    editor: Editor;
    format?: string;
    type?: TypeEnum;
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  }) => void;
}

/**
 * ToolbarButton is the base button for any button on the toolbars.
 * It requires the `type` of action to perform and the format that will be added.
 *
 * It displays a tooltip text on hover. If tooltip text is not passed as a prop it will use the capitalized text of the format
 */

export const ToolbarButton = React.forwardRef(
  (
    {
      tooltip,
      placement = 'top',
      icon = <MdCropSquare />,
      type,
      disabled,
      disableOnSelection = false,
      disableOnCollapse = false,
      format,
      onMouseDown,
      isActive,
      ...rest
    }: ToolbarButtonProps,
    ref: Ref<HTMLButtonElement>,
  ) => {
    const editor = useSlate();

    /**
     * If no tooltip prop is passed it generates a default based on the format string.
     * Converts - into spaces and uppercases the first letter of the first word.
     */
    const defaultTooltip = () => {
      return (format.charAt(0).toUpperCase() + format.substring(1)).replace('-', ' ');
    };

    /**
     * Toggles mark| block and forwards the onMouseDown event
     */
    const handleOnMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      switch (type) {
        case 'mark':
          editor.toggleMark(format);
          break;
        case 'block':
          editor.toggleBlock(format);
      }
      onMouseDown && onMouseDown({ editor, format, type, event });
    };

    const checkIsActive = () => {
      if (isActive) {
        return isActive();
      }

      switch (type) {
        case 'mark':
          return editor.isMarkActive(format);
        case 'block':
          return editor.isBlockActive(format);
        case 'link':
          return editor.isNodeTypeActive(format);
      }
      return;
    };

    /**
     * Conditionally disables the button
     */
    const isDisabled = () => {
      let disabled = false;
      disabled = disableOnSelection ? editor.isSelectionExpanded() : false;
      disabled = disableOnCollapse ? editor.isSelectionCollapsed() : disabled;
      return disabled;
    };

    return disabled || isDisabled() ? (
      <IconButton
        aria-label={tooltip ? tooltip : defaultTooltip()}
        variant={checkIsActive() ? 'solid' : 'ghost'}
        ref={ref}
        isActive={checkIsActive()}
        onMouseDown={(event) => handleOnMouseDown(event)}
        disabled={disabled || isDisabled()}
        height="8"
        {...rest}
      >
        {icon}
      </IconButton>
    ) : (
      <Tooltip label={tooltip ? tooltip : defaultTooltip()} placement={placement}>
        <IconButton
          aria-label={tooltip ? tooltip : defaultTooltip()}
          variant={checkIsActive() ? 'solid' : 'ghost'}
          ref={ref}
          isActive={checkIsActive()}
          onMouseDown={(event) => handleOnMouseDown(event)}
          disabled={disabled || isDisabled()}
          height="8"
          {...rest}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  },
);

ToolbarButton.displayName = 'ToolbarButton';

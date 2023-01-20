import { LinkElement } from 'components/Slate/slateTypes';
import { ReactNode } from 'react';
import { MdOpenInNew, MdOutlineDelete } from 'react-icons/md';
import { useFocused, useSelected, useSlateStatic } from 'slate-react';

// TODO: extract styles to a classes!!

export const LinkToolbar = ({
  attributes,
  element,
  children,
}: {
  attributes: Record<string, unknown>;
  element: LinkElement;
  children: ReactNode;
}) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <span className="element-link" style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {selected && focused && (
        <span
          contentEditable={false}
          className="popup"
          style={{
            position: 'absolute',
            top: '-30px',
            width: '200px',
            display: 'flex',
            border: '1px solid black',
            borderRadius: '8px',
            padding: '5px 10px',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}
        >
          <a href={element.url} rel="noreferrer" target="_blank">
            <MdOpenInNew />
          </a>
          <span
            style={{
              maxWidth: '140px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
            }}
          >
            {element.url}
          </span>
          <MdOutlineDelete
            style={{ cursor: 'pointer' }}
            onMouseDown={(e) => {
              e.stopPropagation();
              editor.removeLink();
            }}
          />
        </span>
      )}
    </span>
  );
};

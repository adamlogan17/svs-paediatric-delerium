import { SnackbarContent, CustomContentProps, useSnackbar } from "notistack";
import { forwardRef, useCallback } from "react";
import BaseAlert from "./BaseAlert";

/**
 * Below is how props are added to a variant of the notistack snackbar
 */
// interface VariantProps extends CustomContentProps {
//   severity?:'error'|'warning'|'info'|'success';
//   icon?:React.ReactNode;
// }

/**
 * @link https://notistack.com/features/customization#custom-variant-(typescript)
 * @link https://codesandbox.io/s/github/iamhosseindhv/notistack/tree/master/examples/custom-snackbar-example-2?file=/src/ReportComplete.tsx
 */

/**
 * `BaseSnackbarVarient` is a custom snackbar content component that utilizes the noistack's `SnackbarContent` component for layout and styles. It receives and displays a message, and allows for dismissing the snackbar.
 *
 * @see {@link https://notistack.com/features/customization#custom-variant-(typescript) Customisation feature in notistack}
 * @see {@link https://codesandbox.io/s/github/iamhosseindhv/notistack/tree/master/examples/custom-snackbar-example-2?file=/src/ReportComplete.tsx CodeSandbox Example}
 *
 * @author Adam Logan
 * @function BaseSnackbarVarient
 * 
 * @param {CustomContentProps} props - Props for the component, passed when called by 'enqueueSnackbar'
 * @param {string} props.id - ID for the snackbar to be used for dismissal, passed when called by 'enqueueSnackbar'
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the component
 *
 * @returns {React.ReactNode}
 */
const BaseSnackbarVarient = forwardRef<HTMLDivElement, CustomContentProps>(({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();
    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    const message:string = props.message ? props.message.toString() : "Error";

    return (
      <SnackbarContent ref={ref}>
        <BaseAlert message={message} closeAction={() => handleDismiss()} severity={props.variant} />
      </SnackbarContent>
    );
  }
);

export default BaseSnackbarVarient;
import type React from "react";

import "./button.css";

export interface ButtonExternalProps {
	/** Is this the principal call to action on the page? */
	variant?: "primary" | "secondary";
	/** What background color to use */
	backgroundColor?: string;
	/** How large should the button be? */
	size?: "small" | "medium" | "large";
	/** Button contents */
	children: React.ReactNode;
	/** Optional click handler */
	onClick?: () => void;
}

export type ButtonProps = ButtonExternalProps &
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>;

/** Primary UI component for user interaction */
export const Button = ({
	variant,
	size = "medium",
	backgroundColor,
	children,
	...props
}: ButtonProps) => {
	const mode = variant ? `button--${variant}` : "button--primary";
	return (
		<button
			type="button"
			className={["button", `button--${size}`, mode].join(
				" ",
			)}
			style={{ backgroundColor }}
			{...props}
		>
			{children}
		</button>
	);
};

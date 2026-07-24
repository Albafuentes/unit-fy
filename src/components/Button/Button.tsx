import type React from "react";

import "./button.css";

export interface ButtonExternalProps {
	/** Is this the principal call to action on the page? */
	variant?: "solid" | "outline" | "ghost" | "link";

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
	children,
	className,
	...props
}: ButtonProps) => {
	const mode = variant ? `button--${variant}` : "button--solid";
	return (
		<button
			type="button"
			className={`button ${size ? `button--${size}` : ""} ${mode} ${className ?? ""}`}
			{...props}
		>
			{children}
		</button>
	);
};

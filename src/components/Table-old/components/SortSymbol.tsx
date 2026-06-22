
import type { SortDirection } from "../hooks/use-table-sort.hook";

export interface SortSymbolProps {
	isSorted: boolean;
	sortDirection: SortDirection | null;
}

const SortSymbol: React.FC<SortSymbolProps> = ({ isSorted, sortDirection }) => {
	const defaultStyles = {
		size: 16,
		stroke: !isSorted ? "gray" : "currentColor",
	};

	// Determine sort icon
	// ArrowUp = A→Z (ascending)
	// ArrowDown = Z→A (descending, default)

	if (isSorted && sortDirection === "asc") {
		return <span>{"↑"}</span>;
	} else if (isSorted && sortDirection === "desc") {
		return <span>{"↓"}</span>;
	} else {
		return <span>{"↕"}</span>;
	}
};

export default SortSymbol;
SortSymbol.displayName = "SortSymbol";

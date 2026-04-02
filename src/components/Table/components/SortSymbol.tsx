import { ArrowDownAZ, ArrowDownUp, ArrowUpAZ } from "lucide-react";
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
		return <ArrowUpAZ style={defaultStyles} data-testid="arrow-up" />;
	} else if (isSorted && sortDirection === "desc") {
		return <ArrowDownAZ style={defaultStyles} data-testid="arrow-down" />;
	} else {
		return <ArrowDownUp style={defaultStyles} data-testid="arrow-down-up" />;
	}
};

export default SortSymbol;
SortSymbol.displayName = "SortSymbol";

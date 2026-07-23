import { Button } from "../../Button/Button";
import type { FilterState, Filters } from "../hooks/use-table-controller.hook";

const Filter = <T extends object>({
	filters,
	action,
}: FilterState<T>): React.JSX.Element => {
	return (
		<div className="table-filter">
			{filters.map((filter: Filters<T>) => {
				if (filter.keyAccessor === null || filter.value === null) {
					return null;
				}

				const keyAccessor = filter.keyAccessor;
				const value = filter.value;

				return (
					<Button
						key={String(keyAccessor)}
						onClick={() => action(keyAccessor, value)}
					>
						{String(keyAccessor)}
					</Button>
				);
			})}
		</div>
	);
};

export default Filter;
Filter.displayName = "Table.Filter";

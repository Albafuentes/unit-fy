import type { Filters } from "../hooks/use-table-controller.hook";

export type FilterProps<T extends object> = {
	filters: Filters<T>[]; //publicProp
	action?: (value: unknown) => void; // interal prop
	reset?: () => void; // interal prop
};

const Filter = <T extends object>({
	filters,
	action,
	reset,
}: FilterProps<T>) => {
	return (
		<div className="table-filter">
			{filters.map((filter) =>
				filter.render(
					() => {
						action?.(filter.value);
					},
					() => {
						reset?.();
					},
				),
			)}
		</div>
	);
};
Filter.displayName = "Table.Filter";
export default Filter;

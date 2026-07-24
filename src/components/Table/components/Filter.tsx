import React from "react";
import type { Filters } from "../hooks/use-table-controller.hook";

export type FilterProps<T extends object> = {
	filters: Filters<T>[]; //publicProp
	action?: (value: unknown, keyAccessor: keyof T) => void; // interal prop
	reset?: (keyAccessor: keyof T) => void; // interal prop
};

const Filter = <T extends object>({
	filters,
	action,
	reset,
}: FilterProps<T>) => {
	return (
		<div className="table-filter">
			{filters.map((filter) => (
				<React.Fragment key={String(filter.keyAccessor)}>
					{filter.render(
						(value: unknown) => {
							action?.(value, filter.keyAccessor);
						},
						() => {
							reset?.(filter.keyAccessor);
						},
					)}
				</React.Fragment>
			))}
		</div>
	);
};
Filter.displayName = "Table.Filter";
export default Filter;

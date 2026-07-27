import React, { type JSX } from "react";

export type TableFilters<T> = {
	keyAccessor: keyof T;
	render: (action: (value: unknown) => void, reset: () => void) => JSX.Element;
};

export type PublicFilterProps<T extends object> = {
	filters: TableFilters<T>[]; //publicProp
};

import type { FiltersState } from "../hooks/use-table-controller.hook";

export type FilterProps<T extends object> = PublicFilterProps<T> &
	Partial<FiltersState<T>>; //internalProp

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

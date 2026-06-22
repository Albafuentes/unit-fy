import type { FilterState } from "../hooks/use-table-controller.hook";

const Filter = <T extends object>({ filters, action }: FilterState<T>) => {
	console.log(filters, action);
	return <div>Filter</div>;
};

export default Filter;
Filter.displayName = "Filter";

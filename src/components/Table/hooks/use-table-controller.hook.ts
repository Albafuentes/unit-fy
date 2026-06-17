import { useState } from "react";
import { buildColumns } from "../helpers/columns.helper";
import { sortedData } from "../helpers/sort.helper";
import type { TableTypes } from "../types/table.types";

type SortState<T> = {
	keyAccessor: keyof T | null;
	direction: TableTypes.SortDirection;
	action: (
		direction: TableTypes.SortDirection,
		keyAccessor: keyof T,
		data: T[],
	) => void;
};

export const useTableController = <T extends object>(
	data: T[],
	config: TableTypes.Column<T>[] | undefined,
) => {
	const [dataTable, setDataTable] = useState(data);
	const [parseColumns, setParseColumns] = useState(
		buildColumns<T>(data, config),
	);

	const actionSort = (
		direction: TableTypes.SortDirection,
		keyAccessor: keyof T,
	) => {
		if (!direction) {
			return;
		}
		const newData = sortedData(direction, keyAccessor, dataTable);
		setDataTable(newData);

		const buildedColumns = buildColumns<T>(newData, config);
		setParseColumns(buildedColumns);

		setSortState((prevState) => ({
			...prevState,
			keyAccessor,
			direction,
		}));
	};

	const [sortState, setSortState] = useState<SortState<T>>({
		keyAccessor: null,
		direction: null,
		action: (direction: TableTypes.SortDirection, keyAccessor: keyof T) =>
			actionSort(direction, keyAccessor),
	});

    //TODO:ADD filter & pagination

	return {
		dataTable,
		parseColumns,
		sortState,
	};
};

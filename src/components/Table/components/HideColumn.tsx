import { IconColumns3 } from "@tabler/icons-react";
import type React from "react";

import Menu from "../../Menu";
import type { HideColumnState } from "../hooks";
import type { TableTypes } from "../types/table.types";

export interface HideColumnProps<T extends object> {
	hideColumnState: HideColumnState<T>;
	config: TableTypes.Column<T>[] | undefined;
	parsedColumns: TableTypes.Column<T>[];
}

const HideColumns = <T extends object>({
	hideColumnState,
	config,
	parsedColumns,
}: HideColumnProps<T>): React.JSX.Element => {
	const accessorKeys: (keyof T)[] = config
		?.map((column) => (column.isHidable === true ? column.accessorKey : ""))
		.filter((accessorKey) => accessorKey !== "") as (keyof T)[];

	return (
		<Menu.Provider>
			<Menu.Trigger>
				<IconColumns3 stroke={2} size={18} />
				Column Visibility
			</Menu.Trigger>
			<Menu.Content size="sm">
				{!accessorKeys || accessorKeys.length === 0 ? (
					<Menu.Item>No Columns</Menu.Item>
				) : (
					accessorKeys.map((accessorKey) => {
						const hasColumn = parsedColumns.find(
							(column) => column.accessorKey === accessorKey,
						);

						return (
							<Menu.Item
								key={`hide-column-${String(accessorKey)}`}
								as={"input"}
								type="checkbox"
								value={accessorKey.toString()}
								checked={hasColumn !== undefined}
								action={() =>
									hideColumnState.action?.([accessorKey], !hasColumn)
								}
								aria-label={`Toggle visibility for ${accessorKey.toString()}`}
							>
								{`Show ${accessorKey.toString()}`}
							</Menu.Item>
						);
					})
				)}
			</Menu.Content>
		</Menu.Provider>
	);
};

export default HideColumns;
HideColumns.displayName = "Table.HideColumns";

import { IconColumns3, IconDotsVertical } from "@tabler/icons-react";
import type React from "react";
import { v4 as uuidv4 } from "uuid";

import Menu from "../../Menu";
import type { HideColumnState } from "../hooks";
import type { TableTypes } from "../types/table.types";

export interface HideColumnProps<T extends object> {
	hideColumnState: HideColumnState<T>;
	config: TableTypes.Column<T>[] | undefined;
	parseColumns: TableTypes.Column<T>[];
}

const HideColumns = <T extends object>({
	hideColumnState,
	config,
	parseColumns,
}: HideColumnProps<T>): React.JSX.Element => {
	const accessorKeys = config?.map((column) => column.accessorKey);

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
						const hasColumn = parseColumns.find(
							(column) => column.accessorKey === accessorKey,
						);

						return (
							<Menu.Item
								key={`hide-column-${String(accessorKey)}`}
								as={"input"}
								type="checkbox"
								value={accessorKey.toString()}
								checked={hasColumn !== undefined}
								onClick={() =>
									hideColumnState.action([accessorKey], !hasColumn)
								}
								action={() => hideColumnState.action([accessorKey], !hasColumn)}
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

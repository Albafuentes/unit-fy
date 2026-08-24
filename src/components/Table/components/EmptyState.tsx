const EmptyState = ({ colSpan }: { colSpan: number }): React.JSX.Element => {
	return (
		<tbody>
			<tr>
				<td colSpan={colSpan} className="td-empty">
					<p>
						<span>{`(╯°□°）╯`}</span>
						<br />
						<span>No hay datos disponibles en este momento.</span>
					</p>
				</td>
			</tr>
		</tbody>
	);
};

export default EmptyState;
EmptyState.displayName = "Table.EmptyState";

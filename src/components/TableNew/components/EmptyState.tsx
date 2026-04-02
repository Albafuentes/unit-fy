function EmptyState({ colSpan }: { colSpan: number }) {
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
}

export default EmptyState;

import { StyleSheet } from 'react-native';
import { elevation, palette } from '../theme/appTheme';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: palette.background,
		gap: 18,
	},
	heroCard: {
		backgroundColor: palette.surface,
		borderRadius: 28,
		padding: 24,
		...elevation.card,
	},
	eyebrow: {
		color: palette.secondary,
		fontSize: 15,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.8,
		marginBottom: 10,
	},
	title: {
		fontSize: 30,
		lineHeight: 36,
		fontWeight: '700',
		color: palette.text,
	},
	subtitle: {
		fontSize: 18,
		lineHeight: 26,
		color: palette.textMuted,
		marginTop: 8,
	},
	locationCard: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		padding: 24,
		...elevation.card,
	},
	sectionLabel: {
		fontSize: 16,
		fontWeight: '700',
		color: palette.textMuted,
		marginBottom: 10,
	},
	locationText: {
		fontSize: 20,
		lineHeight: 30,
		color: palette.text,
		marginBottom: 20,
	},
	button: {
		backgroundColor: palette.primary,
		paddingVertical: 16,
		paddingHorizontal: 18,
		borderRadius: 18,
		alignItems: 'center',
	},
	buttonDisabled: {
		backgroundColor: '#AABCBF',
	},
	buttonText: {
		color: palette.white,
		fontWeight: '700',
		fontSize: 17,
	},
});

export const locationScreenStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: palette.background,
	},
	heroCard: {
		backgroundColor: palette.surface,
		borderRadius: 28,
		padding: 24,
		marginBottom: 16,
		...elevation.card,
	},
	header: {
		color: palette.text,
	},
	heroText: {
		color: palette.textMuted,
		marginTop: 8,
	},
	addButton: {
		marginBottom: 16,
		backgroundColor: palette.primary,
	},
	addButtonContent: {
		minHeight: 54,
	},
	addButtonLabel: {
		fontSize: 17,
		fontWeight: '700',
	},
	listContent: {
		paddingBottom: 12,
	},
	locationCard: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		...elevation.card,
	},
	locationHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
	},
	markerBadge: {
		width: 48,
		height: 48,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: palette.primarySoft,
	},
	locationCopy: {
		flex: 1,
	},
	locationTitle: {
		color: palette.text,
	},
	locationSubtitle: {
		color: palette.textMuted,
		marginTop: 2,
	},
	locationAddress: {
		color: palette.textMuted,
		marginTop: 16,
	},
	actions: {
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingBottom: 16,
		paddingTop: 4,
	},
	actionButtonContent: {
		minHeight: 48,
		paddingHorizontal: 10,
	},
	actionButtonLabel: {
		fontSize: 16,
		fontWeight: '700',
	},
	deleteButton: {
		borderColor: '#E2B1AA',
	},
	separator: {
		height: 14,
	},
	emptyState: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		padding: 24,
		...elevation.card,
	},
	emptyTitle: {
		color: palette.text,
		marginBottom: 8,
	},
	emptyText: {
		color: palette.textMuted,
	},
});

export const locationScreenNewStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: palette.background,
		padding: 20,
		gap: 18,
	},
	heroCard: {
		backgroundColor: palette.surface,
		borderRadius: 28,
		padding: 24,
		...elevation.card,
	},
	header: {
		color: palette.text,
	},
	heroText: {
		color: palette.textMuted,
		marginTop: 8,
	},
	formCard: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		padding: 20,
		...elevation.card,
	},
	sectionTitle: {
		color: palette.text,
		marginBottom: 16,
	},
	input: {
		marginBottom: 12,
		backgroundColor: palette.surface,
	},
	autocompleteSection: {
		marginBottom: 16,
	},
	helperText: {
		color: palette.textMuted,
		marginBottom: 10,
	},
	loadingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 10,
	},
	loadingText: {
		color: palette.textMuted,
	},
	errorText: {
		color: palette.danger,
		marginBottom: 10,
	},
	suggestionsCard: {
		borderRadius: 18,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: palette.surfaceVariant,
		backgroundColor: palette.background,
	},
	suggestionItem: {
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	suggestionTitle: {
		color: palette.text,
	},
	suggestionSubtitle: {
		color: palette.textMuted,
		marginTop: 2,
	},
	inputOutline: {
		borderRadius: 18,
		borderColor: palette.outline,
	},
	buttonContent: {
		minHeight: 54,
	},
	buttonLabel: {
		fontSize: 17,
		fontWeight: '700',
	},
});

export const createReminderScreenStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: palette.background,
	},
	content: {
		gap: 18,
	},
	heroCard: {
		backgroundColor: palette.surface,
		borderRadius: 28,
		padding: 24,
		...elevation.card,
	},
	title: {
		color: palette.text,
	},
	subtitle: {
		color: palette.textMuted,
		marginTop: 8,
	},
	sectionCard: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		padding: 20,
		...elevation.card,
	},
	sectionTitle: {
		color: palette.text,
		marginBottom: 6,
	},
	sectionBody: {
		color: palette.textMuted,
		marginBottom: 18,
	},
	input: {
		marginBottom: 16,
		backgroundColor: palette.surface,
	},
	inputOutline: {
		borderRadius: 18,
		borderColor: palette.outline,
	},
	button: {
		marginTop: 4,
	},
	primaryButtonContent: {
		minHeight: 56,
	},
	primaryButtonLabel: {
		fontSize: 18,
		fontWeight: '700',
	},
	secondaryButton: {
		borderColor: '#D8B794',
	},
	menuWrapper: {
		marginBottom: 8,
	},
	dateToggleButton: {
		marginTop: 4,
		borderColor: palette.primary,
		borderRadius: 18,
	},
	actionButtonContent: {
		minHeight: 48,
	},
	iosPicker: {
		marginBottom: 8,
	},
	pickerCard: {
		marginTop: 16,
		backgroundColor: palette.background,
		borderRadius: 20,
		padding: 12,
	},
	androidPickerButton: {
		backgroundColor: palette.surface,
		borderRadius: 18,
		paddingVertical: 16,
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	pickerLabel: {
		color: palette.textMuted,
		marginBottom: 4,
	},
	pickerValue: {
		color: palette.text,
	},
});

export const homeScreenStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: palette.background,
	},
	content: {
		gap: 18,
	},
	heroCard: {
		backgroundColor: palette.surface,
		borderRadius: 28,
		padding: 24,
		...elevation.card,
	},
	header: {
		color: palette.text,
		marginBottom: 10,
	},
	heroText: {
		color: palette.textMuted,
	},
	heroStats: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 20,
	},
	statCard: {
		flex: 1,
		backgroundColor: palette.background,
		borderRadius: 22,
		padding: 18,
	},
	statCardAccent: {
		flex: 1,
		backgroundColor: palette.primary,
		borderRadius: 22,
		padding: 18,
	},
	statValue: {
		color: palette.text,
	},
	statValueAccent: {
		color: palette.white,
	},
	statLabel: {
		color: palette.textMuted,
		marginTop: 4,
	},
	statLabelAccent: {
		color: '#DDEEEF',
		marginTop: 4,
	},
	sectionHeader: {
		paddingTop: 6,
	},
	sectionTitle: {
		color: palette.text,
	},
	sectionSubtitle: {
		color: palette.textMuted,
		marginTop: 4,
	},
	card: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		marginBottom: 14,
		...elevation.card,
	},
	cardTitle: {
		color: palette.text,
	},
	cardBody: {
		color: palette.textMuted,
		marginTop: 8,
	},
	metaRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 16,
	},
	metaChip: {
		backgroundColor: palette.primarySoft,
	},
	metaChipText: {
		color: palette.primary,
		fontSize: 14,
	},
	cardActions: {
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingBottom: 16,
		paddingTop: 4,
	},
	actionButtonContent: {
		minHeight: 48,
		paddingHorizontal: 12,
	},
	actionLabel: {
		fontSize: 16,
		fontWeight: '700',
	},
	deleteButton: {
		borderColor: '#E2B1AA',
	},
	emptyState: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		padding: 24,
		...elevation.card,
	},
	emptyTitle: {
		color: palette.text,
		marginBottom: 8,
	},
	emptyText: {
		color: palette.textMuted,
	},
});

export const updateReminderModalStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: palette.background,
	},
	content: {
		gap: 18,
	},
	heroCard: {
		backgroundColor: palette.surface,
		borderRadius: 28,
		padding: 24,
		...elevation.card,
	},
	title: {
		color: palette.text,
	},
	subtitle: {
		color: palette.textMuted,
		marginTop: 8,
	},
	sectionCard: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		padding: 20,
		...elevation.card,
	},
	sectionTitle: {
		color: palette.text,
		marginBottom: 6,
	},
	sectionBody: {
		color: palette.textMuted,
		marginBottom: 18,
	},
	input: {
		marginBottom: 16,
		backgroundColor: palette.surface,
	},
	inputOutline: {
		borderRadius: 18,
		borderColor: palette.outline,
	},
	button: {
		marginTop: 4,
	},
	primaryButtonContent: {
		minHeight: 56,
	},
	primaryButtonLabel: {
		fontSize: 18,
		fontWeight: '700',
	},
	secondaryButton: {
		borderColor: palette.outline,
	},
	menuWrapper: {
		marginBottom: 8,
	},
	dateToggleButton: {
		marginTop: 4,
		borderColor: palette.primary,
		borderRadius: 18,
	},
	actionButtonContent: {
		minHeight: 48,
	},
	iosPicker: {
		marginBottom: 8,
	},
	pickerCard: {
		marginTop: 16,
		backgroundColor: palette.background,
		borderRadius: 20,
		padding: 12,
	},
	androidPickerButton: {
		backgroundColor: palette.surface,
		borderRadius: 18,
		paddingVertical: 16,
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	pickerLabel: {
		color: palette.textMuted,
		marginBottom: 4,
	},
	pickerValue: {
		color: palette.text,
	},
});

export default styles;

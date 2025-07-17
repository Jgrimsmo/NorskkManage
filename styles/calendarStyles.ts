import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  calendarGridMonth: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  calendarDay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
    margin: 2,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  calendarDayToday: {
    backgroundColor: '#E3F2FF',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  calendarDayInactive: {
    backgroundColor: '#F8F8F8',
    opacity: 0.6,
  },
  calendarDayText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  calendarDayTextToday: {
    color: '#007AFF',
    fontWeight: '600',
  },
  calendarDayTextInactive: {
    color: '#999',
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  calendarDayNumberToday: {
    color: '#007AFF',
  },
  calendarDayNumberInactive: {
    color: '#999',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
});

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trade } from '../types';
import { colors, typography, spacing, radii } from '../design/tokens';

interface CalendarGridProps {
    currentDate: Date;
    trades: Trade[];
    onMonthChange: (offset: number) => void;
}

const WEEKS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarGrid({ currentDate, trades, onMonthChange }: CalendarGridProps) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Aggregate trades by day
    const dailyData = useMemo(() => {
        const data: Record<number, { pnl: number; trades: number }> = {};

        trades.forEach((trade) => {
            // Ensure we only look at trades for the current displayed month/year
            // We need to convert trade.timestamp (unix ms) to a date
            const tradeDate = new Date(trade.timestamp);

            // To correctly match local days, we should probably stick to the user's local time 
            // or the app's convention. Assuming local device time for now as trade.timestamp is standard.
            if (
                tradeDate.getFullYear() === year &&
                tradeDate.getMonth() === month &&
                (trade.outcome === 'win' || trade.outcome === 'loss')
            ) {
                const day = tradeDate.getDate();
                if (!data[day]) {
                    data[day] = { pnl: 0, trades: 0 };
                }
                data[day].pnl += (trade.pnl || 0);
                data[day].trades += 1;
            }
        });

        return data;
    }, [trades, year, month]);

    const renderDays = () => {
        const days = [];

        // Empty cells for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const data = dailyData[d];
            const isPositive = data && data.pnl > 0;
            const isNegative = data && data.pnl < 0;
            const isNeutral = !data;

            // Premium colors
            let bg = 'transparent';
            let borderColor = 'transparent';

            if (isPositive) {
                bg = 'rgba(16, 185, 129, 0.2)'; // Emerald 500 with opacity
                borderColor = 'rgba(16, 185, 129, 0.5)';
            }
            if (isNegative) {
                bg = 'rgba(239, 68, 68, 0.2)'; // Red 500 with opacity
                borderColor = 'rgba(239, 68, 68, 0.5)';
            }

            // Text colors
            let dateColor: string = colors.text.tertiary;
            let pnlColor: string = colors.text.primary;

            if (isPositive) pnlColor = '#34D399'; // Emerald 400
            if (isNegative) pnlColor = '#F87171'; // Red 400
            if (!isNeutral) dateColor = 'rgba(255,255,255,0.5)';

            days.push(
                <View key={d} style={[
                    styles.dayCell,
                    { backgroundColor: bg, borderColor: borderColor, borderWidth: isNeutral ? 0 : 1 }
                ]}>
                    <Text style={[styles.dayNumber, { color: dateColor }]}>{d}</Text>
                    {data && (
                        <View style={styles.pnlContainer}>
                            <Text style={[styles.pnlText, { color: pnlColor }]}>
                                {data.pnl >= 0 ? '+' : ''}{Math.round(data.pnl)}
                            </Text>
                        </View>
                    )}
                </View>
            );
        }

        return days;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onMonthChange(-1)} style={styles.navBtn}>
                    <Text style={styles.navText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => onMonthChange(1)} style={styles.navBtn}>
                    <Text style={styles.navText}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Weekday Labels */}
            <View style={styles.grid}>
                {WEEKS.map((d, i) => (
                    <View key={i} style={styles.dayHeader}>
                        <Text style={styles.dayHeaderText}>{d}</Text>
                    </View>
                ))}
                {renderDays()}
            </View>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#34D399' }]} />
                    <Text style={styles.legendText}>Profit</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#F87171' }]} />
                    <Text style={styles.legendText}>Loss</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: radii.lg,
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.md,
        // Removed background color to blend better, or keep it subtle
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    navBtn: {
        padding: spacing.xs,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radii.full,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 18,
        color: colors.text.primary,
        marginTop: -2,
    },
    monthTitle: {
        ...typography.body, // Smaller title
        fontWeight: '600',
        color: colors.text.primary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayHeader: {
        width: '14.28%',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    dayHeaderText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.tertiary,
        opacity: 0.7,
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        borderRadius: radii.md, // More rounded
        padding: 2,
        justifyContent: 'space-between',
        marginBottom: 2, // Slight gap
    },
    dayNumber: {
        fontSize: 10,
        fontWeight: '500',
        marginLeft: 2,
        marginTop: 2,
    },
    pnlContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pnlText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        marginTop: spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    legendText: {
        fontSize: 12,
        color: colors.text.secondary,
    }
});

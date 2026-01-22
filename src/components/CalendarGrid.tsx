import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trade } from '../types';
import { colors, typography, spacing, radii } from '../design/tokens';
import { pnlColor } from '../design/utils';

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

            let bg: string = colors.bg.tertiary;
            if (isPositive) bg = 'rgba(34, 197, 94, 0.2)'; // success with opacity
            if (isNegative) bg = 'rgba(239, 68, 68, 0.2)'; // error with opacity

            let textColor: string = colors.text.primary;
            if (isPositive) textColor = colors.semantic.success;
            if (isNegative) textColor = colors.semantic.error;
            if (isNeutral) textColor = colors.text.tertiary;

            days.push(
                <View key={d} style={[styles.dayCell, { backgroundColor: bg }]}>
                    <Text style={[styles.dayText, { color: textColor }]}>{d}</Text>
                    {data && (
                        <Text style={[styles.pnlText, { color: textColor }]}>
                            {data.pnl >= 0 ? '+' : ''}{Math.round(data.pnl)}
                        </Text>
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
                    <View style={[styles.dot, { backgroundColor: colors.semantic.success }]} />
                    <Text style={styles.legendText}>Profit</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: colors.semantic.error }]} />
                    <Text style={styles.legendText}>Loss</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radii.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    navBtn: {
        padding: spacing.xs,
    },
    navText: {
        fontSize: 24,
        color: colors.text.primary,
        lineHeight: 24,
    },
    monthTitle: {
        ...typography.heading,
        color: colors.text.primary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayHeader: {
        width: '14.28%', // 100% / 7
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    dayHeaderText: {
        ...typography.caption,
        color: colors.text.tertiary,
        fontWeight: 'bold',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radii.sm,
        borderWidth: 1,
        borderColor: colors.bg.primary,
        padding: 2,
    },
    dayText: {
        ...typography.caption,
        fontWeight: '600',
        fontSize: 10,
    },
    pnlText: {
        fontSize: 8,
        fontWeight: 'bold',
        marginTop: 2,
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
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        ...typography.caption,
        color: colors.text.secondary,
    }
});

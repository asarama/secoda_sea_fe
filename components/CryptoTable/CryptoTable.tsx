"use client"
// From https://ui.mantine.dev/component/table-sort/


import { useState } from 'react'
import {
    Table,
    ScrollArea,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
    rem,
    keys,
} from '@mantine/core'
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react'
import classes from './styles.module.css'

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

const Th = ({ children, reversed, sorted, onSort }: ThProps) => {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

interface RowData {
    cmcRank: number
    name: string
}

const data: RowData[] = [
    {
        cmcRank: 1,
        name: 'One',
    },
    {
        cmcRank: 2,
        name: 'Two',
    },
    {
        cmcRank: 3,
        name: 'Three',
    },
];

// TODO: There should be a more scalable way to do this
// https://dev.to/scooperdev/generate-array-of-all-an-interfaces-keys-with-typescript-4hbf
const columns = [
    "cmcRank" as keyof RowData, 
    "name" as keyof RowData,
]

const CryptoTable = () => {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        console.log(value)
    }

    const setSorting = (field: keyof RowData) => {
        console.log(field)
    };

    const rows = data.map((row: RowData) => (
        <Table.Tr key={row.name}>
            {columns.map((column) => {
                return <Table.Td
                    key={row[column]}
                >
                    {row[column]}
                </Table.Td>
            })}
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <TextInput
                placeholder="Search by any field"
                mb="md"
                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            />
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                <Table.Tbody>
                    <Table.Tr>
                        {columns.map((column) => {
                            return <Th
                                sorted={sortBy === column}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting(column)}
                                key={column}
                            >
                                {column}
                            </Th>
                        })}
                    </Table.Tr>
                </Table.Tbody>
                <Table.Tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={Object.keys(data[0]).length}>
                                <Text fw={500} ta="center">
                                    Nothing found
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
}

export default CryptoTable;
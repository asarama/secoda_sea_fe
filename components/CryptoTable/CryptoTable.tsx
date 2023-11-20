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
} from '@mantine/core'
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react'
import classes from './styles.module.css'

import { makeAutoObservable } from "mobx"

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

// Ways we can sort columns
enum SortDirections {
    desc,
    asc,
}

class CryptoService {

    static baseServerUrl = "http://localhost:3000/api/crypto?"
    // TODO: Add an interface for this
    rawData: any[] = []
    nameFilter: string = ""
    sortBy: keyof RowData = columns[0]
    sortDirection: SortDirections = SortDirections.desc

    constructor() {
        makeAutoObservable(this)

        // Get an the initial set of data
        this.fetchData()

        // TODO: Seems like this API fails when the request interval is 1 second
        setInterval(() => {
            this.fetchData()
        }, 5000)
    }

    updateNameFilter(newNameFilter: string) {
        this.nameFilter = newNameFilter
    }

    // TODO: Update doc diagram action name
    updateSortBy(newSortBy: keyof RowData) {
        this.sortBy = newSortBy
    }

    updateSortDirection(newSortDirection: SortDirections) {
        this.sortDirection = newSortDirection
    }

    // TODO: Add to doc diagram
    updateRawData(newRawData: any[]) {
        this.rawData = newRawData
    }

    get requestUrl(): string {
        return CryptoService.baseServerUrl + "start=1&limit=2&sort=market_cap&sort_dir=desc&cryptocurrency_type=all&tag=all"
    }

    get displayData(): RowData[] {
        // TODO: Add type to dataRow
        return this.rawData.map((dataRow) =>{
            return {
                cmcRank: dataRow.cmc_rank,
                name: dataRow.name
            }
        })
    }

    // This method will update our raw data which triggers the rest of our reactions
    async fetchData() {
        const res = await fetch(this.requestUrl)
        const resJson = await res.json()
        // console.log(resJson)

        this.updateRawData(resJson.data)
    }
}

const cryptoService = new CryptoService()

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
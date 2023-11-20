"use client"
// From https://ui.mantine.dev/component/table-sort/

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

import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"

interface RowData {
    marketCap: number
    cmcRank: number
    name: string
}

// TODO: There should be a more scalable way to do this
// https://dev.to/scooperdev/generate-array-of-all-an-interfaces-keys-with-typescript-4hbf
const columns = [
    "marketCap" as keyof RowData, 
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
    // TODO: Update name in doc diagram
    filterString: string = ""
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

    // TODO: Update name in doc diagram
    updateFilterString(newNameFilter: string) {
        this.filterString = newNameFilter
    }

    // TODO: Add to doc diagram
    updateSorting(field: keyof RowData) {
        this.updateSortBy(field)

        // TODO: Clean up this logic. This takes too long to read
        const reversed = field === this.sortBy ? this.sortDirection === SortDirections.asc : false
        this.updateSortDirection(reversed ? SortDirections.desc : SortDirections.asc)
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
        // TODO: Update the search parameters to include updates to sort, and sort_dir
        return CryptoService.baseServerUrl + "start=1&limit=10&sort=market_cap&sort_dir=desc&cryptocurrency_type=all&tag=all"
    }

    get displayData(): RowData[] {

        // First flatten the data to allow easier filtering
        // TODO: Add type to dataRow
        const flatData = this.rawData.map((dataRow) =>{
            return {
                marketCap: dataRow.quote.USD.market_cap,
                cmcRank: dataRow.cmc_rank,
                name: dataRow.name
            }
        })

        // TODO: Move this to another function
        // Then filter the data
        let filteredData: any[] = []
        if (this.filterString !== "") {
            const query = this.filterString.toLowerCase().trim();
            filteredData = flatData.filter((item) =>
                keys(item).some((key) => String(item[key]).toLowerCase().includes(query))
            )
        } else {
            // Use spread operator to make a deepcopy of the objects in rawData
            filteredData = [...flatData]
        }
        
        return filteredData
    }

    // This method will update our raw data which triggers the rest of our reactions
    async fetchData() {
        const res = await fetch(this.requestUrl)
        const resJson = await res.json()
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

const CryptoTable = observer(() => {

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        cryptoService.updateFilterString(value)
    }

    const rows = cryptoService.displayData.map((row: RowData) => (
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
                value={cryptoService.filterString}
                onChange={handleSearchChange}
            />
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                <Table.Tbody>
                    <Table.Tr>
                        {columns.map((column) => {
                            return <Th
                                sorted={cryptoService.sortBy === column}
                                reversed={cryptoService.sortDirection === SortDirections.desc}
                                onSort={() => cryptoService.updateSorting(column)}
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
                            <Table.Td colSpan={columns.length}>
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
})

export default CryptoTable;
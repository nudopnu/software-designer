import { Table } from "./data.model";

export const MockTables: Table[] = [
    {
        name: 'User', attributes: [
            { keyType: 'primary', name: 'id', type: 'INT' },
            { keyType: 'none', name: 'firstname', type: 'VARCHAR(100)' },
            { keyType: 'none', name: 'lastname', type: 'VARCHAR(100)' },
        ]
    },
    {
        name: 'Account', attributes: [
            { keyType: 'primary', name: 'id', type: 'INT' },
            { keyType: 'none', name: 'email', type: 'VARCHAR(100)' },
            { keyType: 'none', name: 'password', type: 'VARCHAR(100)' },
        ]
    },
];
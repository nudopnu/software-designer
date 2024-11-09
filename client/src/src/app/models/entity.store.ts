import { patchState, signalStore, withMethods } from '@ngrx/signals';
import {
    addEntity,
    removeEntities,
    removeEntity,
    updateEntity,
    withEntities
} from '@ngrx/signals/entities';
import { Position, Table } from './data.model';
import { TableEntity, toTableEntity } from './entities.model';

export const TableStore = signalStore(
    { providedIn: 'root' },
    withEntities<TableEntity>(),
    withMethods((store) => ({
        addEntity(entity: Table, position: Position = { x: 0, y: 0 }): void {
            const newEntity = toTableEntity(entity, position);
            storeLog("add entity", newEntity);
            patchState(store, addEntity(newEntity));
        },
        setEntitySelected(entity: TableEntity, selected = true) {
            patchState(store, updateEntity({
                id: entity.id,
                changes: () => ({ selected }),
            }))
        },
        setEntityName(entity: TableEntity, name: string) {
            patchState(store, updateEntity({
                id: entity.id,
                changes: () => ({ name }),
            }))
        },
        deleteEntity(entity: TableEntity) {
            storeLog("delete entity", entity);
            patchState(store, removeEntity(entity.id));
        },
        deleteSelectedEntities() {
            storeLog("delete selected entities")
            patchState(store, removeEntities(entity => entity.selected));
        },
    })),
);

function storeLog(action: string, value?: any) {
    console.groupCollapsed(`[ENTITYSTORE - ${action.toUpperCase()}]:`, value);
    console.groupEnd();
}
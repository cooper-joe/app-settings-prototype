import i18n from '@dhis2/d2-i18n'
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import { Tile } from '../tiles/Tile.jsx'
import { TILES } from '../tiles/tiles.jsx'
import {
    hiddenTileIds,
    hideTile,
    moveTile,
    showTile,
    toggleSize,
} from './layout.js'
import styles from './layout.module.css'
import { LayoutGrid } from './LayoutGrid.jsx'

const SortableTile = ({ tile, onHide, onToggleSize }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tile.id })
    const title = TILES[tile.id].title()
    const className = [
        tile.size === 'wide' ? styles.wide : '',
        isDragging ? styles.dragging : '',
    ].join(' ')

    return (
        <div
            ref={setNodeRef}
            className={className}
            style={{ transform: CSS.Translate.toString(transform), transition }}
        >
            <Tile id={tile.id}>
                <div className={styles.tools}>
                    <button
                        type="button"
                        ref={setActivatorNodeRef}
                        className={styles.handle}
                        {...attributes}
                        {...listeners}
                        aria-label={i18n.t('Move {{title}}', { title })}
                    >
                        ⠿
                    </button>
                    <button
                        type="button"
                        className={styles.tool}
                        aria-label={
                            tile.size === 'wide'
                                ? i18n.t('Make {{title}} normal', { title })
                                : i18n.t('Make {{title}} wide', { title })
                        }
                        onClick={() => onToggleSize(tile.id)}
                    >
                        {tile.size === 'wide'
                            ? i18n.t('Normal')
                            : i18n.t('Wide')}
                    </button>
                    <button
                        type="button"
                        className={styles.tool}
                        aria-label={i18n.t('Hide {{title}}', { title })}
                        onClick={() => onHide(tile.id)}
                    >
                        {i18n.t('Hide')}
                    </button>
                </div>
            </Tile>
        </div>
    )
}

SortableTile.propTypes = {
    tile: PropTypes.shape({ id: PropTypes.string, size: PropTypes.string })
        .isRequired,
    onHide: PropTypes.func.isRequired,
    onToggleSize: PropTypes.func.isRequired,
}

export const LayoutEditor = ({ layout, onChange, disabled }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    if (disabled) {
        return <LayoutGrid layout={layout} />
    }

    const handleDragEnd = ({ active, over }) => {
        if (over && active.id !== over.id) {
            onChange(moveTile(layout, active.id, over.id))
        }
    }
    const hidden = hiddenTileIds(layout)

    return (
        <div className={styles.editor}>
            <h4 className={styles.areaTitle}>
                {i18n.t('On the home screen')}
            </h4>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={layout.tiles.map((tile) => tile.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className={styles.grid}>
                        {layout.tiles.map((tile) => (
                            <SortableTile
                                key={tile.id}
                                tile={tile}
                                onHide={(id) => onChange(hideTile(layout, id))}
                                onToggleSize={(id) =>
                                    onChange(toggleSize(layout, id))
                                }
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <h4 className={styles.areaTitle}>{i18n.t('Hidden')}</h4>
            {hidden.length === 0 ? (
                <p className={styles.empty}>
                    {i18n.t('Every tile is on the home screen.')}
                </p>
            ) : (
                <ul className={styles.hidden}>
                    {hidden.map((id) => {
                        const title = TILES[id].title()
                        return (
                            <li key={id} className={styles.hiddenTile}>
                                <span>{title}</span>
                                <button
                                    type="button"
                                    className={styles.tool}
                                    aria-label={i18n.t('Show {{title}}', {
                                        title,
                                    })}
                                    onClick={() =>
                                        onChange(showTile(layout, id))
                                    }
                                >
                                    {i18n.t('Show')}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

LayoutEditor.propTypes = {
    layout: PropTypes.shape({ tiles: PropTypes.array.isRequired }).isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

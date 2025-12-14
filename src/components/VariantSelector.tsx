"use client";

import { useReducer } from "react";
import type { Product, SelectedVariant, VariantOption } from "#data/types";
import { getAttributeDisplay } from "#data/variant-config";
import { clsx } from "clsx";

type SelectionState = Record<string, string | number | undefined>;

type SelectionAction = {
    type: "SET";
    key: string;
    value: string | number;
};

type VariantSelectorProps = {
    product: Product;
    onVariantChange: (
        variant: SelectedVariant | undefined,
        isValid: boolean,
    ) => void;
};

function extractAttributeKeys(options: VariantOption[]) {
    if (options.length === 0) {
        return [];
    }
    return Object.keys(options[0].attributes);
}

function extractAttributeValues(options: VariantOption[], key: string) {
    const values = new Set<string | number>();
    for (const option of options) {
        for (const value of option.attributes[key] ?? []) {
            values.add(value);
        }
    }
    return [...values];
}

function findMatchingOption(
    options: VariantOption[],
    selected: SelectionState,
) {
    return options.find((option) => {
        for (const [key, values] of Object.entries(option.attributes)) {
            const selectedValue = selected[key];
            if (
                selectedValue === undefined || !values.includes(selectedValue)
            ) {
                return false;
            }
        }
        return true;
    });
}

function buildInitialState(options: VariantOption[]) {
    const keys = extractAttributeKeys(options);
    const state: SelectionState = {};

    for (const key of keys) {
        const values = extractAttributeValues(options, key);
        state[key] = values.length === 1 ? values[0] : undefined;
    }

    return state;
}

function computeValidation(state: SelectionState, options: VariantOption[]) {
    const keys = extractAttributeKeys(options);

    for (const key of keys) {
        if (state[key] === undefined) {
            return { variant: undefined, isValid: false };
        }
    }

    const variant: SelectedVariant = {};
    for (const key of keys) {
        variant[key] = state[key]!;
    }

    const match = findMatchingOption(options, state);
    const isValid = match !== undefined && match.quantity > 0;

    return { variant, isValid };
}

function getInitialVariantState(product: Product) {
    if (product.options.length === 0) {
        return { variant: undefined, isValid: true };
    }

    const state = buildInitialState(product.options);
    return computeValidation(state, product.options);
}

function selectionReducer(state: SelectionState, action: SelectionAction) {
    return { ...state, [action.key]: action.value };
}

function VariantSelector({ product, onVariantChange }: VariantSelectorProps) {
    const attributeKeys = extractAttributeKeys(product.options);

    const attributeValues: Record<string, (string | number)[]> = {};
    for (const key of attributeKeys) {
        attributeValues[key] = extractAttributeValues(product.options, key);
    }

    const [state, dispatch] = useReducer(
        selectionReducer,
        product.options,
        buildInitialState,
    );

    function handleSelect(key: string, value: string | number) {
        const newState = { ...state, [key]: value };
        dispatch({ type: "SET", key, value });

        const { variant, isValid } = computeValidation(
            newState,
            product.options,
        );
        onVariantChange(variant, isValid);
    }

    if (product.options.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
            {attributeKeys.map((key) => {
                const config = getAttributeDisplay(key);
                return (
                    <OptionGroup
                        key={key}
                        label={key}
                        options={attributeValues[key]}
                        selected={state[key]}
                        onSelect={(value) => handleSelect(key, value)}
                        suffix={config.suffix}
                    />
                );
            })}
        </div>
    );
}

type OptionGroupProps = {
    label: string;
    options: (string | number)[];
    selected: string | number | undefined;
    onSelect: (value: string | number) => void;
    suffix?: string;
};

function OptionGroup(
    { label, options, selected, onSelect, suffix = "" }: OptionGroupProps,
) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-bold">{label}</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={String(option)}
                        type="button"
                        onClick={() => onSelect(option)}
                        className={clsx(
                            "btn btn-sm capitalize",
                            selected === option ? "btn-primary" : "btn-outline",
                        )}
                        aria-pressed={selected === option}
                    >
                        {option}
                        {suffix}
                    </button>
                ))}
            </div>
        </div>
    );
}

export { getInitialVariantState, VariantSelector };

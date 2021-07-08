import React from 'react';
import { useForm } from "react-hook-form";

export const Form = ({ defaultValues, children, onSubmit, formClass }) => {
    const { handleSubmit, register } = useForm({ defaultValues });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
            {Array.isArray(children)
                ? children.map((child) => {
                    return child.props.name
                        ? React.createElement(child.type, {
                            ...{
                                ...child.props,
                                register,
                                key: child.props.name
                            }
                        })
                        : child;
                })
                : children}
        </form>
    )
}

export const Input = ({ register, name, ...rest }) => {
    return <input {...register(name)} {...rest} />;
}

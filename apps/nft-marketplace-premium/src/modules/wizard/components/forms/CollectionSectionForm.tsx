import { Button, Grid, Paper, Stack, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionItem } from '../../../../types/config';

import AddIcon from '@mui/icons-material/Add';
import * as Yup from 'yup';
import { AppPageSection, CollectionAppPageSection } from '../../types/section';
import { PageSectionItem } from '../PageSectionItem';
import AddItemForm from './AddItemForm';

interface Form {
  title: string;
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  title: Yup.string().required(),
});

interface Props {
  onSave: (section: AppPageSection) => void;
  onCancel: () => void;
  section?: CollectionAppPageSection;
}

export default function CollectionSectionForm({
  onSave,
  onCancel,
  section,
}: Props) {
  const [showAddItem, setShowAddItem] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const [items, setItems] = useState<SectionItem[]>(
    section ? section.items : []
  );

  const handleSubmit = (values: Form, helpers: FormikHelpers<Form>) => {
    onSave({
      type: 'collections',
      items,
      title: values.title,
    });
  };

  const formik = useFormik({
    initialValues: section
      ? {
          title: section.title,
        }
      : {
          title: '',
        },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  const handleRemoveItem = (index: number) => {
    setItems((items: SectionItem[]) => {
      let newItems = [...items];

      newItems.splice(index, 1);

      return newItems;
    });
  };

  const handleEditItem = (index: number) => {
    setSelectedItemIndex(index);
    setShowAddItem(true);
  };

  const handleAddItem = () => {
    setShowAddItem(true);
  };

  const handleSwapItem = (direction: 'up' | 'down', index: number) => {
    setItems((items: SectionItem[]) => {
      let newItems = [...items];
      if (direction === 'up') {
        const swapItem = newItems[index - 1];
        newItems[index - 1] = newItems[index];
        newItems[index] = swapItem;
      } else {
        const swapItem = newItems[index + 1];
        newItems[index + 1] = newItems[index];
        newItems[index] = swapItem;
      }
      return newItems;
    });
  };

  const handleSubmitItem = (item: SectionItem) => {
    if (selectedItemIndex > -1) {
      setItems((value) => {
        const newItems = [...value];

        newItems[selectedItemIndex] = item;

        return newItems;
      });
    } else {
      setItems((value) => [...value, item]);
    }

    setShowAddItem(false);
  };

  const handleCancelItem = () => {
    setShowAddItem(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="title"
            onChange={formik.handleChange}
            fullWidth
            value={formik.values.title}
            label={<FormattedMessage id="title" defaultMessage="Title" />}
            error={Boolean(formik.errors.title)}
            helperText={
              Boolean(formik.errors.title) ? formik.errors.title : undefined
            }
          />
        </Grid>

        {!showAddItem &&
          items.map((item, index) => (
            <Grid item xs={12} key={index}>
              <PageSectionItem
                item={item}
                length={items.length}
                index={index}
                onEdit={handleEditItem}
                onSwap={handleSwapItem}
                onRemove={handleRemoveItem}
              />
            </Grid>
          ))}
        {showAddItem ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <AddItemForm
                item={
                  selectedItemIndex > -1 ? items[selectedItemIndex] : undefined
                }
                onCancel={handleCancelItem}
                onSubmit={handleSubmitItem}
              />
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Button
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              variant="outlined"
              fullWidth
            >
              <FormattedMessage id="add.item" defaultMessage="Add item" />
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button
              disabled={!formik.isValid}
              type="submit"
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
            <Button onClick={onCancel}>
              <FormattedMessage id="save" defaultMessage="Cancel" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

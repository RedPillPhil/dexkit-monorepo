import { Cancel } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  createTheme,
  Divider,
  Grid,
  responsiveFontSizes,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Fonts from 'src/constants/fonts.json';
import { getTheme } from '../../../../theme';
import { AppConfig } from '../../../../types/config';
import { customThemeAtom } from '../../state';
import { StepperButtonProps } from '../../types';
import { generateTheme } from '../../utils';
import ThemeSection from '../sections/ThemeSection';
import { StepperButtons } from '../steppers/StepperButtons';
import ThemePreview from '../ThemePreview';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
  showSwap?: boolean;
}

export default function ThemeWizardContainer({
  config,
  onSave,
  onChange,
  isOnStepper,
  stepperButtonProps,
  showSwap,
}: Props) {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(config.theme);
  const [selectedFont, setSelectedFont] = useState<
    { family: string; category?: string } | undefined
  >(config?.font);
  const customTheme = useAtomValue(customThemeAtom);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleShowPreview = () => {
    setIsPreviewOpen(true);
  };

  const handleSelectTheme = useCallback(
    (id: string) => {
      setSelectedThemeId(id);
    },
    [selectedThemeId]
  );

  const selectedTheme = useMemo(() => {
    return generateTheme({ selectedFont, customTheme, selectedThemeId });
  }, [selectedThemeId, customTheme, selectedFont]);

  const handleCancelEdit = () => {
    setSelectedThemeId(config.theme);
  };

  const renderThemePreview = () => {
    if (selectedTheme) {
      return <ThemePreview selectedTheme={selectedTheme} showSwap={showSwap} />;
    }
  };
  const handleSave = () => {
    const newConfig = { ...config, theme: selectedThemeId };
    if (newConfig.theme === 'custom' && customTheme) {
      newConfig.customTheme = JSON.stringify(customTheme);
    }
    if (selectedFont) {
      newConfig.font = selectedFont;
    }
    onSave(newConfig);
  };
  useEffect(() => {
    const newConfig = { ...config, theme: selectedThemeId };
    if (newConfig.theme === 'custom' && customTheme) {
      newConfig.customTheme = JSON.stringify(customTheme);
    }
    if (selectedFont) {
      newConfig.font = selectedFont;
    }
    onChange(newConfig);
  }, [selectedThemeId, selectedFont, customTheme]);

  const handleSelectedFont = (event: any, value: string | null) => {
    if (value) {
      const font = Fonts.items.find((f) => f.family === value);
      if (font) {
        setSelectedFont({ family: font.family, category: font.category });
      }
    } else {
      setSelectedFont(undefined);
    }
  };

  return (
    <>
      <Head>
        {selectedFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${selectedFont.family}&display=swap`}
            rel="stylesheet"
          />
        )}
      </Head>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'subtitle2'}>
              <FormattedMessage id="theme" defaultMessage="Theme" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="choose.your.theme"
                defaultMessage="Choose your theme"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box pb={2}>
            <Autocomplete
              disablePortal
              id="font-selection"
              value={selectedFont?.family}
              onChange={handleSelectedFont}
              options={Fonts.items.map((f) => f.family)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <FormattedMessage id={'font'} defaultMessage={'Font'} />
                  }
                />
              )}
            />
          </Box>

          <ThemeSection
            selectedId={selectedThemeId}
            onSelect={handleSelectTheme}
            onPreview={handleShowPreview}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderThemePreview()}
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          {isOnStepper ? (
            <StepperButtons
              {...stepperButtonProps}
              handleNext={() => {
                handleSave();
                if (stepperButtonProps?.handleNext) {
                  stepperButtonProps.handleNext();
                }
              }}
              disableContinue={false}
            />
          ) : (
            <Stack spacing={1} direction="row" justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleSave}>
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button startIcon={<Cancel />} onClick={handleCancelEdit}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
}

/*
 * Copyright Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { FC } from 'react';
import {
  useEntityPresentation,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { Link } from '@backstage/core-components';
import {
  CompoundEntityRef,
  Entity,
  parseEntityRef,
} from '@backstage/catalog-model';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useDropdownManager } from '../../hooks';
import { HeaderDropdownComponent } from './HeaderDropdownComponent';
import { DropdownEmptyState } from './DropdownEmptyState';

/**
 * @public
 * Props for each starred entitify item
 */
interface SectionComponentProps {
  entityRef: string | CompoundEntityRef | Entity;
  toggleStarredEntity: (
    entityOrRef: Entity | CompoundEntityRef | string,
  ) => void;
  handleClose: () => void;
}

const StarredItem: FC<SectionComponentProps> = ({
  entityRef,
  toggleStarredEntity,
  handleClose,
}) => {
  const { Icon, primaryTitle, secondaryTitle } =
    useEntityPresentation(entityRef);
  const { name, kind, namespace } = parseEntityRef(entityRef as string);
  const theme = useTheme();

  return (
    <MenuItem
      component={Link}
      to={`/catalog/${namespace || 'default'}/${kind}/${name}`}
      onClick={handleClose}
      disableRipple
      disableTouchRipple
    >
      {Icon && (
        <ListItemIcon sx={{ minWidth: 36 }}>
          <Icon />
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          <Typography sx={{ color: theme.palette.text.primary }}>
            {primaryTitle || secondaryTitle}
          </Typography>
        }
        secondary={kind.toLocaleUpperCase()}
        // inset={!Icon}
        sx={{ ml: 1, mr: 1 }}
      />
      <Tooltip title="Remove from list">
        <IconButton
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleStarredEntity(entityRef);
          }}
        >
          <Star color="warning" />
        </IconButton>
      </Tooltip>
    </MenuItem>
  );
};

export const StarredDropdown = () => {
  const { anchorEl, handleOpen, handleClose } = useDropdownManager();
  const { starredEntities, toggleStarredEntity } = useStarredEntities();

  const entitiesArray = Array.from(starredEntities);

  return (
    <HeaderDropdownComponent
      buttonContent={<StarBorderIcon />}
      onOpen={handleOpen}
      onClose={handleClose}
      anchorEl={anchorEl}
      tooltip="Your starred items"
      isIconButton
    >
      {entitiesArray.length > 0 ? (
        <>
          <ListItemText
            primary="Your starred items"
            sx={{ pl: 2, mt: 1, fontWeight: 'bold', color: 'text.secondary' }}
          />
          {entitiesArray.map(enitityRef => (
            <StarredItem
              key={enitityRef}
              entityRef={enitityRef}
              toggleStarredEntity={toggleStarredEntity}
              handleClose={handleClose}
            />
          ))}
        </>
      ) : (
        <DropdownEmptyState
          title="No starred items yet"
          subTitle="Click the star icon next to an entity's name to save it here for quick access."
          icon={<AutoAwesomeIcon sx={{ fontSize: 64 }} color="disabled" />}
        />
      )}
    </HeaderDropdownComponent>
  );
};
